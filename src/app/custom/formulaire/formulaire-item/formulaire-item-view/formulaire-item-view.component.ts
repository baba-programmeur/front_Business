import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormulaireItem} from '../../../../_model/formulaire-item';
import {Champ} from '../../../../_model/champ';
import {FormulaireService} from '../../../../_service/autre/formulaire.service';

@Component({
  selector: 'app-formulaire-item-view',
  templateUrl: './formulaire-item-view.component.html',
  styleUrls: ['./formulaire-item-view.component.scss']
})
export class FormulaireItemViewComponent implements OnInit {
  @Input()
  formItem: any;
  // @Output()
  // onSelect: EventEmitter<any> = new EventEmitter<any>();

  selectedChamp: any;
  selectedItem: any;
  selectedType: string;
  selected = false;
  nbChamps = 0;
  champWidth = 100;
  champDisplay = 'block';

  regexVisible: boolean;
  requiredVisible: boolean;
  minLengthVisible: boolean;
  maxLengthVisible: boolean;

  constructor(private formulaireService: FormulaireService) { }

  ngOnInit() {
    if (this.formItem.champs) {
      this.nbChamps = this.formItem.champs.length;

      if (this.nbChamps != 0) {
        if (this.formItem.type === 'LIGNE') {
          this.champDisplay = 'inline-block';
          this.champWidth = 100/this.nbChamps;
        } else if (this.formItem.type === 'COLONNE') {
          this.champDisplay = 'block';
          this.champWidth = 100;
        }
      }
    }

    // subscribe to formulaireElement edit
    this.formulaireService.formulaireElementToEdit
        .subscribe(
            data => {
              this.selected = false;

              if (data.type == 'item') {
                if (data.item && data.item.id === this.formItem.id) {
                  this.selected = true;
                } else {
                  this.selected = false;
                }
              } else if (data.type == 'champ') {
                if (data.champ && this.selectedChamp && data.champ.id === this.selectedChamp.id) {
                  this.selected = true;
                } else {
                  this.selected = false;
                }
              }
            }
        );
  }

  hasValidation(val) {
    if (this.selectedChamp && this.selectedChamp.validations) {
      for (let validation of this.selectedChamp.validations) {
        if (validation.typeValidation === val) {
          return true;
        }
      }
    }

    return false;
  }

  onEdit(event, type) {
    this.selectedType = type;

    if (type == 'champ') {
      this.selectedChamp = event;

      // init values
      if (this.hasValidation('REGEX')) {
        this.regexVisible = true;
      } else {
        this.regexVisible = false;
      }

      if (this.hasValidation('REQUIRED')) {
        this.requiredVisible = true;
      } else {
        this.requiredVisible = false;
      }

      if (this.hasValidation('MIN_LENGTH')) {
        this.minLengthVisible = true;
      } else {
        this.minLengthVisible = false;
      }

      if (this.hasValidation('MAX_LENGTH')) {
        this.maxLengthVisible = true;
      } else {
        this.maxLengthVisible = false;
      }

      this.formulaireService.formulaireElementToEdit.next({
        type: type,
        champ: event,
        requiredVisible: this.requiredVisible,
        minLengthVisible: this.minLengthVisible,
        maxLengthVisible: this.maxLengthVisible,
        regexVisible: this.regexVisible
      });

      // this.onSelect.emit({
      //   type,
      //   champ: event,
      //   requiredVisible: this.requiredVisible,
      //   minLengthVisible: this.minLengthVisible,
      //   maxLengthVisible: this.maxLengthVisible,
      //   regexVisible: this.regexVisible
      // });

    }
    else if (type == 'item') {
      this.selectedItem = event;

      this.formulaireService.formulaireElementToEdit.next({
        type,
        item: event
      });

      // this.onSelect.emit({
      //   type,
      //   item: event
      // });
    }
  }

  onAddItem(selectedItem) {
    let formulaireItem: FormulaireItem = new FormulaireItem();
    formulaireItem.type   = 'LIGNE';
    formulaireItem.niveau = 1;
    formulaireItem.formulaireItemId = selectedItem.id;

    this.formulaireService.formulaireElementToEdit.next({
      type: 'item',
      item: formulaireItem
    });
  }

  onDeleteItem(selectedItem) {
    this.formulaireService.formulaireElementToEdit.next({
      type: 'item',
      item: selectedItem,
      action: 'delete'
    });
  }

  onAddChamp(selectedItem) {
    let champ: Champ = new Champ();

    champ.slug    = 'inconnu';
    champ.label   = 'Inconnu';
    champ.type    = 'text';
    champ.visible = true;
    champ.formulaireItemId = selectedItem.id;

    this.formulaireService.formulaireElementToEdit.next({
      type: 'champ',
      champ: champ
    });
  }

  parseOptions(val) {
    return JSON.parse(val);
  }
}
