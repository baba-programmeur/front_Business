import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Formulaire} from '../../../_model/formulaire';
import {FormulaireService} from '../../../_service/autre/formulaire.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormulaireItemService} from '../../../_service/autre/formulaire-item.service';
import {FormulaireItem} from '../../../_model/formulaire-item';
import {Champ} from '../../../_model/champ';
import {ChampService} from '../../../_service/autre/champ.service';
import {ChampValidation} from '../../../_model/champ-validation';
import {OptionsAddComponent} from '../options-add/options-add.component';
import {ConfirmDeleteComponent} from '../../global/confirm-delete/confirm-delete.component';
import {SelectOption} from '../../../_model/select-option';
import {EditEntityComponent} from '../../global/edit-entity/edit-entity.component';

declare var swal;

@Component({
    selector: 'app-formulaire-item',
    templateUrl: './formulaire-item.component.html',
    styleUrls: ['./formulaire-item.component.scss']
})
export class FormulaireItemComponent implements OnInit {
    formulaire: Formulaire;
    formDetails: any;
    selected: any;
    selectedType: string;
    regexVisible: boolean;
    requiredVisible: boolean;
    minLengthVisible: boolean;
    maxLengthVisible: boolean;
    formChamp: FormGroup;
    formItem: FormGroup;
    formulaires: any[];
    options: SelectOption[] = [];

    constructor(public dialogRef: MatDialogRef<FormulaireItemComponent>,
                private dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private formulaireService: FormulaireService,
                private champService: ChampService,
                private formulaireItemService: FormulaireItemService) {
        if (data) {
            this.formulaire = data.formulaire;
        }

        this.formItem = new FormGroup({
            typeItem: new FormControl('', [Validators.required]),
            niveau: new FormControl('', [Validators.required]),
        });

        this.formChamp = new FormGroup({
            slug: new FormControl('', [Validators.required]),
            label: new FormControl('', [Validators.required]),
            placeholder: new FormControl('', []),
            type: new FormControl('', [Validators.required]),
            visible: new FormControl('', [Validators.required]),
            readOnly: new FormControl('', [Validators.required]),
            required: new FormControl(this.requiredVisible, [Validators.required]),
            minLength: new FormControl(this.minLengthVisible, [Validators.required]),
            maxLength: new FormControl(this.maxLengthVisible, [Validators.required]),
            regex: new FormControl(this.regexVisible, [Validators.required]),
            dependsOnFieldTag: new FormControl('', []),
            dependsOnFieldValue: new FormControl('', []),
            required_message: new FormControl('', []),
            min_length_val: new FormControl('', []),
            min_length_message: new FormControl('', []),
            max_length_val: new FormControl('', []),
            max_length_message: new FormControl('', []),
            regex_val: new FormControl('', []),
            regex_message: new FormControl('', []),
        });
    }

    ngOnInit() {
        if (this.formulaire) {
            this.getFormulaireDetails();
        }
        // subscription to formulaireElementEdit
        this.formulaireService.formulaireElementToEdit
            .subscribe(
                data => {
                    this.onSelect(data);
                }
            );

    }

    // getFormulaires() {
    //     this.formulaireService.getAll()
    //         .subscribe((result: any[]) => {
    //
    //             if (result) {
    //                 this.formulaires = result;
    //                 if (this.formulaires.length != 0) {
    //                     this.formulaire = this.formulaires[0];
    //
    //                     if (this.formulaire) {
    //                         this.getFormulaireDetails();
    //                     }
    //                 }
    //             }
    //         });
    // }

    /**
     * Get formulaire details
     */
    getFormulaireDetails() {
        this.formulaireService.findFormulaireDetails(this.formulaire.slug)
            .subscribe(
                formDetails => {
                    console.log('Formulaire details : ');
                    console.log(formDetails);
                    this.formDetails = formDetails;
                }
            );
    }

    /**
     * Get validation message
     *
     * @param val
     */
    getValidationMessage(val) {
        if (this.selected && this.selected.validations) {
            for (const validation of this.selected.validations) {
                if (validation.typeValidation === val) {
                    return validation.errorMessage;
                }
            }
        }
        return '';
    }

    /**
     * Get validation value
     * @param val
     */
    getValidationValue(val) {
        if (this.selected && this.selected.validations) {
            for (const validation of this.selected.validations) {
                if (validation.typeValidation === val) {
                    return validation.valeur;
                }
            }
        }
        return '';
    }

    /**
     * On select
     *
     * @param data
     */
    onSelect(data) {
        this.options = [];
        if (data) {
            this.selectedType = data.type;
            if (data.type === 'champ') {
                this.selected         = data.champ;
                this.formChamp.controls['type'].setValue(this.selected.type);
                this.requiredVisible  = data.requiredVisible;
                this.minLengthVisible = data.minLengthVisible;
                this.maxLengthVisible = data.maxLengthVisible;
                this.regexVisible     = data.regexVisible;

                if (this.selected.type === 'select') {
                    if (this.selected.optionsValue) {
                        this.options = JSON.parse(this.selected.optionsValue);
                    }
                }

                if (this.selected.id == null) { // ajouter un nouveau champ
                    console.log('new champ');
                    console.log(this.selected);

                    swal(
                        {
                            title: 'Confirmation',
                            text: 'Ajouter un nouveau champ ?',
                            buttons: {
                                cancel: {
                                    text: 'Annuler',
                                    value: 'no',
                                    visible: true
                                },
                                confirm: {
                                    text: 'Confirmer',
                                    value: 'yes',
                                }
                            }
                        }).then(
                        resp => {
                            console.log('Result', resp);

                            if (resp === 'yes') {
                                this.champService.add(this.selected)
                                    .subscribe(
                                        // tslint:disable-next-line:no-shadowed-variable
                                        (resp: Champ) => {
                                            console.log('new champ add');
                                            console.log(resp);

                                            this.getFormulaireDetails();
                                        }
                                    );
                            }
                        });
                }
            }
            else if (data.type === 'item') {
                this.selected = data.item;

                if (this.selected.id == null) { // on ajoute une nouvelle ligne / colonne
                    swal(
                        {
                            title: 'Confirmation',
                            text: 'Ajouter une nouvelle ligne/colonne ?',
                            buttons: {
                                cancel: {
                                    text: 'Annuler',
                                    value: 'no',
                                    visible: true
                                },
                                confirm: {
                                    text: 'Confirmer',
                                    value: 'yes',
                                }
                            }
                        }).then(
                        resp => {
                            console.log('Result', resp);

                            if (resp === 'yes') {
                                this.formulaireItemService.add(this.selected)
                                    .subscribe(
                                        // tslint:disable-next-line:no-shadowed-variable
                                        (resp: FormulaireItem) => {
                                            console.log('new item add');
                                            console.log(resp);

                                            this.getFormulaireDetails();
                                        }
                                    );
                            }
                        });

                }
                else if (data.action && data.action === 'delete') { // on supprime une ligne/colonne
                    swal(
                        {
                            title: 'Confirmation',
                            text: 'Vous allez supprimer la ligne/colonne ?',
                            buttons: {
                                cancel: {
                                    text: 'Annuler',
                                    value: 'no',
                                    visible: true
                                },
                                confirm: {
                                    text: 'Confirmer',
                                    value: 'yes',
                                }
                            }
                        }).then(
                        resp => {
                            console.log('Result', resp);

                            if (resp == 'yes') {
                                this.formulaireItemService.delete(this.selected)
                                    .subscribe(
                                        // tslint:disable-next-line:no-shadowed-variable
                                        resp => {
                                            console.log('Formulaire item deleted');
                                            console.log(resp);

                                            this.getFormulaireDetails();
                                        }
                                    );
                            }
                        });

                }
            }
        }
    }

    /**
     * on delete champ
     *
     * @param champ
     */
    onDeleteChamp(champ) {
        swal(
            {
                title: 'Confirmation',
                text: 'Vous allez supprimer le champ ?',
                buttons: {
                    cancel: {
                        text: 'Annuler',
                        value: 'no',
                        visible: true
                    },
                    confirm: {
                        text: 'Confirmer',
                        value: 'yes',
                    }
                }
            }).then(
            resp => {
                console.log('Result', resp);

                if (resp === 'yes') {
                    this.champService.delete(champ)
                        .subscribe(
                            // tslint:disable-next-line:no-shadowed-variable
                            resp => {
                                console.log('champ deleted ', resp);
                                this.getFormulaireDetails();
                            }
                        );
                }
            });


    }

    /**
     * On delete item
     *
     * @param item
     */
    onDeleteItem(item) {
        swal(
            {
                title: 'Confirmation',
                text: 'Vous allez supprimer la ligne/colonne ?',
                buttons: {
                    cancel: {
                        text: 'Annuler',
                        value: 'no',
                        visible: true
                    },
                    confirm: {
                        text: 'Confirmer',
                        value: 'yes',
                    }
                }
            }).then(
            resp => {
                console.log('Result', resp);

                if (resp === 'yes') {
                    this.formulaireItemService.delete(item)
                        .subscribe(
                            // tslint:disable-next-line:no-shadowed-variable
                            resp => {
                                console.log('formulaire item deleted ', resp);
                                this.getFormulaireDetails();
                            }
                        );
                }
            });

    }

    /**
     * On add item
     */
    onAddItem() {
        swal(
            {
                title: 'Confirmation',
                text: 'Ajouter une nouvelle ligne/colonne ?',
                buttons: {
                    cancel: {
                        text: 'Annuler',
                        value: 'no',
                        visible: true
                    },
                    confirm: {
                        text: 'Confirmer',
                        value: 'yes',
                    }
                }
            }).then(
            resp => {
                console.log('Result', resp);

                if (resp === 'yes') {
                    const formulaireItem: FormulaireItem = new FormulaireItem();
                    formulaireItem.type   = 'LIGNE';
                    formulaireItem.niveau = 1;
                    formulaireItem.formulaireId = this.formulaire.id;

                    this.formulaireItemService.add(formulaireItem)
                        .subscribe(
                            // tslint:disable-next-line:no-shadowed-variable
                            (resp: FormulaireItem) => {
                                console.log('new item add');
                                console.log(resp);

                                this.getFormulaireDetails();
                            }
                        );
                }
            });

    }

    /**
     * On save
     *
     * @param selected
     */
    onSave(selected) {
        if (this.selectedType == 'champ') {
            const champ: Champ = selected;
            champ.slug = this.formChamp.value.slug;
            champ.label = this.formChamp.value.label;
            champ.placeholder = this.formChamp.value.placeholder;
            champ.type = this.formChamp.value.type;

            champ.visible = this.formChamp.value.visible;
            champ.readonly = this.formChamp.value.readonly;

            if (champ.type === 'select') {
                champ.optionsType = 'fixe';
                champ.optionsValue = JSON.stringify(this.options);
            }

            // get validations
            const validations = [];

            const required = new ChampValidation();
            if (this.formChamp.value.required) {
                required.champId = champ.id;
                required.typeValidation = 'REQUIRED';
                required.valeur  = '1';
                required.errorMessage  = this.formChamp.value.required_message;

                validations.push(required.serialize());
            }

            const minLength = new ChampValidation();
            if (this.formChamp.value.minLength) {
                minLength.champId = champ.id;
                minLength.typeValidation = 'MIN_LENGTH';
                minLength.valeur  = this.formChamp.value.min_length_val;
                minLength.errorMessage  = this.formChamp.value.min_length_message;

                validations.push(minLength.serialize());
            }

            const maxLength = new ChampValidation();
            if (this.formChamp.value.maxLength) {
                maxLength.champId = champ.id;
                maxLength.typeValidation = 'MAX_LENGTH';
                maxLength.valeur  = this.formChamp.value.max_length_val;
                maxLength.errorMessage  = this.formChamp.value.max_length_message;

                validations.push(maxLength.serialize());
            }

            const regex = new ChampValidation();
            if (this.formChamp.value.regex) {
                regex.champId = champ.id;
                regex.typeValidation = 'REGEX';
                regex.valeur  = this.formChamp.value.regex_val;
                regex.errorMessage  = this.formChamp.value.regex_message;

                validations.push(regex.serialize());
            }

            champ.validations = validations;

            this.champService.edit(champ)
                .subscribe(
                    resp => {
                        console.log('champ edited');
                        console.log(resp);

                        this.getFormulaireDetails();
                    }
                );
        }
        else if (this.selectedType == 'item') {

            const formulaireItem: FormulaireItem = selected;
            formulaireItem.type   = this.formItem.value.typeItem;
            formulaireItem.niveau = +this.formItem.value.niveau;

            this.formulaireItemService.edit(formulaireItem)
                .subscribe(
                    resp => {
                        console.log('formulaire item edited');
                        console.log(resp);

                        this.getFormulaireDetails();
                    }
                );
        }
    }

    onNewOption() {
        this.dialog.open(EditEntityComponent, {
            width: '400px',
            data: {
                title: 'Ajouter une option',
                fields: [
                    {label: 'Label', tag: 'label', type: 'text', valeur: '', required: true},
                    {label: 'Valeur', tag: 'valeur', type: 'text', valeur: '', required: true},
                ],
                validate: (option: SelectOption) => {
                    return new Promise(resolve => {
                        this.options.push(option);
                        resolve(1);
                    });
                }
            }
        });
    }

    onDeleteOption(option: SelectOption) {
        this.dialog.open(ConfirmDeleteComponent, {
            width: '350px',
            data: {
                message: 'Vous allez supprimer cette option ?',
                fields: [{label: option.label, valeur: option.valeur}]
            }
        })
            .afterClosed().subscribe(
                result => {
                    if (!result.canceled) {
                        const index: number = this.options.indexOf(option);
                        console.log('__ _INdex ', index);
                        console.log('__ Option ', option);
                        console.log('__ Options ', this.options);

                        if (index !== -1) {
                            this.options.splice(index, 1);
                        }
                    }
            });
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
