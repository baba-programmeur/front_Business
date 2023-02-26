import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-options-add',
  templateUrl: './options-add.component.html',
  styleUrls: ['./options-add.component.scss']
})
export class OptionsAddComponent implements OnInit {
  form: FormGroup;

  constructor(fb: FormBuilder,
              public dialogRef: MatDialogRef<OptionsAddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = fb.group({
      'label': new FormControl("", Validators.required),
      'valeur': new FormControl("", Validators.required),
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    let data = this.form.value;

    console.log("___ DATA ");
    console.log(data);

    this.dialogRef.close({data});
  }

  onCancel() {
    this.dialogRef.close();
  }

}
