import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {SelectOption} from '../../../_model/select-option';
import {MatDialog} from '@angular/material/dialog';
import {FormulaireService} from '../../../_service/autre/formulaire.service';

declare var swal;

@Component({
    selector: 'app-formulaire-data',
    templateUrl: './formulaire-data.component.html',
    styleUrls: ['./formulaire-data.component.scss']
})
export class FormulaireDataComponent implements OnInit {
    //From page who call this
    //formulaireSlug was passed in parameter
    @Input()
    formulaireSlug: String;

    formDetails: any;
    selected: any;
    selectedType: string;
    regexVisible: boolean;
    requiredVisible: boolean;
    minLengthVisible: boolean;
    maxLengthVisible: boolean;
    formChamp: FormGroup;
    formulaires: any[];
    options: SelectOption[] = [];
    @Output()
    onFormChange: EventEmitter<any> = new EventEmitter<any>();

    globalForm: FormGroup;

    constructor(private dialog: MatDialog,
                private formulaireService: FormulaireService) {
        if (!this.globalForm) {
            this.globalForm = new FormGroup({});
        }
    }

    ngOnInit() {
        if (this.formulaireSlug) {
            console.log("+++++++ formulaire slug : "+this.formulaireSlug)
            this.getFormulaireDetails(this.formulaireSlug);
        }
    }

    /**
     * Get formulaire details
     */
    getFormulaireDetails(slug) {
        console.log("+++++++ In getFormulaireDetails with slug :"+slug)
        this.formulaireService.findFormulaireDetails(slug)
            .subscribe(
                formDetails => {
                    console.log("******************* response from api get formulaire");
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

    onChampChange(data) {
        this.globalForm.removeControl(data.slug);
        this.globalForm.addControl(data.slug, data.control);
        this.onFormChange.emit(this.globalForm);
    }
}
