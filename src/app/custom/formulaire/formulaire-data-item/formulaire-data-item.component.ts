import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-formulaire-data-item',
  templateUrl: './formulaire-data-item.component.html',
  styleUrls: ['./formulaire-data-item.component.scss']
})
export class FormulaireDataItemComponent implements OnInit {
  @Input()
  formItem: any;
  @Input()
  globalForm: FormGroup;
  @Output()
  onChampChange: EventEmitter<any> = new EventEmitter<any>();

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

  constructor() {
    if (!this.globalForm) {
      this.globalForm = new FormGroup({});
    }
  }

  ngOnInit() {
    if (this.formItem.champs) {
      this.nbChamps = this.formItem.champs.filter(x => x.visible === true).length;

      if (this.nbChamps !== 0) {
        if (this.formItem.type === 'LIGNE') {
          this.champDisplay = 'inline-block';
          this.champWidth = 100 / this.nbChamps;
        } else if (this.formItem.type === 'COLONNE') {
          this.champDisplay = 'block';
          this.champWidth = 100;
        }
      }
    }
  }

  parseOptions(val) {
    return JSON.parse(val);
  }

  addControlAndGetSlug(champ) {
    const validations = champ.validations;
    const control = new FormControl('');

    if (champ.dependsOnFieldTag) {
      //console.log('Le champ', champ.slug, ' depend de ', champ.dependsOnFieldTag, ' avec la valeur : ', champ.dependsOnFieldValue);
    }

    if (validations) {
      const validators = [];

      for (const validation of validations) {
        switch (validation.typeValidation) {
          case 'REQUIRED':
            if (validation.valeur === '1') {
              validators.push(Validators.required);
            }
            break;
          case 'MIN_LENGTH':
            validators.push(Validators.minLength(validation.valeur));
            break;
          case 'MAX_LENGTH':
            validators.push(Validators.maxLength(validation.valeur));
            break;
          case 'REGEX':
            validators.push(Validators.pattern(validation.valeur));
            break;
          default: break;
        }
      }
      control.setValidators(validators);
    }

    if (this.globalForm && !this.globalForm.contains(champ.slug)) {
      this.globalForm.addControl(champ.slug, control);

      this.emitOnChampChange(champ.slug);
    }

    return champ.slug;
  }

  getErrorMessage(champ) {
    const errors: any = this.globalForm.controls[champ.slug].errors;
    this.emitOnChampChange(champ.slug);

    if (errors) {
      if (errors.required) {
        return this.getMessage('REQUIRED', champ.validations, champ.slug);
      } else if (errors.minlength) {
        return this.getMessage('MIN_LENGTH', champ.validations, champ.slug);
      } else if (errors.maxlength) {
        return this.getMessage('MAX_LENGTH', champ.validations, champ.slug);
      } else if (errors.pattern) {
        return this.getMessage('REGEX', champ.validations, champ.slug);
      }
    }
  }

  emitOnChampChange(slug) {
    this.onChampChange.emit({slug: slug, control: this.globalForm.controls[slug]});
  }

  onchangeChamp(data) {
    this.onChampChange.emit(data);
  }

  getMessage(type, validations: any[], slug) {
    if (validations) {
      for (const validation of validations) {
        if (validation.typeValidation === type) {
          return validation.errorMessage;
        }
      }
    } else {
      switch (type) {
        case 'REQUIRED':
          if (slug.toLowerCase() !== 'echeance') {
            return slug + ' est obligatoire';
          } else {
            return 'La date d\'échéance doit etre supérieure à la date d\'aujourd\'hui.'
          }
        case 'REGEX':
          return slug + ' est incorrect';
        default:
          console.log('Message du champ: ', slug);
          console.log(type);
          console.log(validations);
          return ''
      }
    }
    console.log('Message du champ: ', slug);
    console.log(type);
    console.log(validations);
    return '';
  }

  onChangeSelect($event: Event, champ) {
    console.log('select change value', this.globalForm.value[champ.slug]);
    console.log(champ);
    switch (champ.slug.toLowerCase()) {
      case 'notif_sms' :
        switch (this.globalForm.value.notif_sms.toLowerCase()) {
          case 'oui':
            this.globalForm.controls['telephone'].setValidators([Validators.required]);
            this.emitOnChampChange('telephone');
            break;
          case 'non':
            this.globalForm.controls['telephone'].setValidators([]);
            this.emitOnChampChange('telephone');
            break;
          default:
            break;
        }
        break;
      case 'notif_email' :
        switch (this.globalForm.value.notif_email.toLowerCase()) {
          case 'oui':
            // tslint:disable-next-line:max-line-length
            this.globalForm.controls['email'].setValidators([Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]);
            this.emitOnChampChange('email');
            break;
          case 'non':
            // tslint:disable-next-line:max-line-length
            this.globalForm.controls['email'].setValidators([Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]);
            this.emitOnChampChange('email');
            break;
          default:
            break;
        }
        break;
      case 'type':
        switch (this.globalForm.value.type.toLowerCase()) {
          case 'personne_morale':
          case 'personne morale':
          case 'pm':
            // spécifique à personne morale
            this.globalForm.get('rcc').enable();
            this.emitOnChampChange('rcc');

            this.globalForm.get('raison_sociale').enable();
            this.globalForm.controls['raison_sociale'].setValidators([Validators.required]);
            this.emitOnChampChange('raison_sociale');

            this.globalForm.get('ninea').enable();
            this.globalForm.controls['ninea'].setValidators([Validators.required]);
            this.emitOnChampChange('ninea');

            this.globalForm.get('prenom').disable();
            this.globalForm.controls['prenom'].setValidators([]);
            this.emitOnChampChange('prenom');

            this.globalForm.get('nom').disable();
            this.globalForm.controls['nom'].setValidators([]);
            this.emitOnChampChange('nom');
            break;
          case 'personne_physique':
          case 'personne physique':
          case 'pp':
            // spécifique à personne physique
            this.globalForm.get('raison_sociale').disable();
            this.globalForm.controls['raison_sociale'].setValidators([]);
            this.emitOnChampChange('raison_sociale');

            this.globalForm.get('ninea').disable();
            this.globalForm.controls['ninea'].setValidators([]);
            this.emitOnChampChange('ninea');

            this.globalForm.get('rcc').disable();
            this.emitOnChampChange('rcc');

            this.globalForm.get('prenom').enable();
            this.globalForm.controls['prenom'].setValidators([Validators.required]);
            this.emitOnChampChange('prenom');

            this.globalForm.get('nom').enable();
            this.globalForm.controls['nom'].setValidators([Validators.required]);
            this.emitOnChampChange('nom');
            break;
          default:
            break;
        }
        break;
      default:
        //
    }
    /*
      if (champ.slug.toLowerCase() === 'notif_sms') {
        console.log('notif_sms');
        switch (this.globalForm.value.notif_sms.toLowerCase()) {
          case 'oui':
            this.globalForm.controls['telephone'].setValidators([Validators.required]);
            this.emitOnChampChange('telephone');
            break;
          case 'non':
            this.globalForm.controls['telephone'].setValidators([]);
            this.emitOnChampChange('telephone');
            break;
          default:
            break;
        }
      } else {
        if (champ.slug.toLowerCase() === 'notif_email') {
          console.log('notif_email');
          switch (this.globalForm.value.notif_email.toLowerCase()) {
            case 'oui':
              // tslint:disable-next-line:max-line-length
              this.globalForm.controls['email'].setValidators([Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]);
              this.emitOnChampChange('email');
              break;
            case 'non':
              // tslint:disable-next-line:max-line-length
              this.globalForm.controls['email'].setValidators([Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]);
              this.emitOnChampChange('email');
              break;
            default:
              break;
          }
        }
      }
    */
  }

  dateOnChange($event: Event, champ: any) {
    if (champ.slug.toLowerCase() === 'echeance') {
      if (this.validationDate(this.globalForm.value.echeance)) {
        console.log('je suis la ---------');
        this.globalForm.controls['echeance'].setValue('');
        this.globalForm.controls['echeance'].setValidators(Validators.required);
        this.emitOnChampChange('echeance');
      } else {
        this.globalForm.controls['echeance'].setErrors(null);
        this.emitOnChampChange('echeance');
      }
    }
  }

  validationDate(echeance): Boolean {
    if (echeance !== '') {
      const today = new Date();
      const tab = echeance.split('/');
      const ech = new Date(echeance);
      if (today > ech) {
        return true;
      } else {
        return false;
      }
    }
  }

  champsVisible() {
    return
  }
}
