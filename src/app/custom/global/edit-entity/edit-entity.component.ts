import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {isArray} from 'util';
import {debounceTime, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.scss']
})
export class EditEntityComponent implements OnInit {
  title: string;
  hideCancelButton: boolean = false;
  fields: any[];
  formGroup: FormGroup;
  validate: (value: any) => Promise<any>;

  constructor(public dialogRef: MatDialogRef<EditEntityComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.title = data.title;
      this.fields = data.fields;
      this.validate = data.validate;
      this.hideCancelButton = data.hideCancelButton;
    }

    console.log('____ cancelButton ', this.hideCancelButton);
  }

  ngOnInit() {
    this.formGroup = new FormGroup({});

    this.fields.forEach(field => {
      let cntrl;
      let valeur;

      if (field.type === 'autocomplete') {
        valeur = field.valeur.label;
      } else {
        valeur = field.valeur;
      }

      if (field.required) {
        /*if (field.type === 'email') {
          cntrl = new FormControl(valeur, Validators.required)
        } else {*/
        cntrl = new FormControl(valeur, Validators.required);
        // }
      } else {
        cntrl = new FormControl(valeur);
        // TODO: voir avec Souleymane ??? : this.formGroup.addControl(field.tag, new FormControl(''));
      }

      if (field.type === 'autocomplete') {
        cntrl.valueChanges
          .pipe(
            debounceTime(500),
            switchMap(value => this.autoCompleteOnChangeSearch(value, field))
          )
          .subscribe(data => {
            field.options = data;
          });
      }

      this.formGroup.addControl(field.tag, cntrl);
    });
  }

  /**
   * @param value //
   */
  closeDialog(value) {
    this.dialogRef.close(value);
  }

  /**
   * Close dialog
   */
  onCancel() {
    this.closeDialog({submit: false});
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.validate(this.formGroup.value)
        .then(
          (resp) => {
            console.log('___ response');
            console.log(resp);
            if (resp && !resp.error) {
              this.closeDialog({submit: true, entity: resp});
            }
            // this.closeDialog({submit: true, entity: resp});
          }
        );
    }
  }

  onChange(field) {
    console.log('Le champs selectionné');
    console.log(field);
    console.log('-------------------------------');
    const onChange = field.onChange(this.formGroup.value);

    if (onChange) {
      onChange.then(
        (data) => {
          if (data) {
            data.forEach(item => {
              const newTag = item.tag;

              const options = item.options;

              for (const fieldItem of this.fields) {
                if (fieldItem.tag === newTag) {
                  fieldItem.options = options;
                  this.formGroup.controls[fieldItem.tag].setValue('');
                  break;
                }
              }
            });
          }
        }
      );
    }
  }

  private _filterOptions(value: string, options): any[] {
    const filterValue = value.toLowerCase();

    return options.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
   * change search on autocomplete
   *
   * @param value //
   * @param field //
   */
  autoCompleteOnChangeSearch(value, field) {
    const onChangeSearch = field.onChangeSearch(value);

    if (onChangeSearch) {
      return onChangeSearch.then(
        (data) => {
          if (data) {
            const newTag = field.tag;

            for (const fieldItem of this.fields) {
              if (fieldItem.tag === newTag) {
                return data;
              }
            }
          }
        }
      );
    }
  }

  /**
   * select event for autocomplete
   *
   * @param option //
   * @param field //
   */
  autoCompleteSelectEvent(option, field) {

    this.formGroup.controls[field.tag].setValue(option.label);

    const onSelectEvent = field.onSelectEvent(option);

    if (onSelectEvent) {
      onSelectEvent.then(
        (data) => {
          if (data && isArray(data)) {
            data.forEach(item => {
              const newTag = item.tag;

              const options = item.options;

              for (const fieldItem of this.fields) {
                if (fieldItem.tag === newTag) {
                  fieldItem.options = options;

                  if (fieldItem.type === 'toggle') {
                    this.formGroup.controls[fieldItem.tag].setValue(fieldItem.valeur);
                  } else {
                    this.formGroup.controls[fieldItem.tag].setValue('');
                  }

                  break;
                }
              }
            });
          }
        }
      );
    }
  }
}
