import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import {CampagneService} from '../../../_service/autre/campagne.service';

import {FormBuilder, Validators} from '@angular/forms';
import * as moment from 'moment';
import {DatePipe} from '@angular/common';
import { DetailsCampagneFieldsToUpdate } from 'app/_model/DetailsCampagneFieldsToUpdate';
import { FieldsToUpdate } from 'app/_constant/FieldsToUpdateName';

const Swal = require('sweetalert2');
const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
})

// todo ******************* ne supprime aucun commentaire sinon cela affectera les changements futur *****************

@Component({
    selector: 'app-show-detail',
    templateUrl: './show-detail.component.html',
    styleUrls: ['./show-detail.component.scss'],
    providers: [DatePipe]
})
export class ShowDetailComponent implements OnInit {
    title: string;
    nomPartenaire: string;
    details: any[];
    addSouscription = false;
    isEditable = false;
    fomulaireDataItemId: any;
    dialogRef: MatDialogRef<any>;
    isEditableConfirm = false;

    tab: Array<{
        libelle: string,
        value: string,
        isEditable: boolean
    }> = [];
    transitDetailFound: Array<{
        libelle: string,
        value: string,
        isEditable: boolean
    }> = [];

    email: string = '';
    type: string = '';
    telephone: string = '';
    motif: string = '';
    prenom: string = '';
    nom: string = '';
    echeance: any;
    todayDate = new Date();
    statut: any;

    today = new Date();
    dd = String(this.today.getDate()).padStart(2, '0');
    mm = String(this.today.getMonth() + 1).padStart(2, '0'); //January is 0!
    yyyy = this.today.getFullYear();

    today_ = this.dd + '/' + this.mm + '/' + this.yyyy;
    // today_ = new Date();
    // isModify false


    formUpdateDetailsCampagne = this.fb.group({
        // nom: ['', Validators.required],
        // prenom: ['', Validators.required],
        echeance: ['', Validators.required]
        // motif: [''],
        // telephone: ['', Validators.required],
        // type: ['', Validators.required],
        // email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });
    eche: Date;
    translateLibelle(libelle : String){
        libelle = libelle.toUpperCase()
        switch (libelle) {
            case 'CREATEDAT' :
                return 'date création'
            case 'UPDATEAT' :
                return 'date modification'
            case 'NOMCLIENT' :
                return 'nom client'
            case 'MESSAGERETOUR' :
                return 'message'
            case 'AGENCE' :
                return 'code partenaire'
            case 'IDCLIENT' :
                return 'id client'
            case 'IDDETAILSCOMPAGNE' :
                return 'id ligne details'
            case 'TYPE_PIECE' :
                return 'id ligne details'
            case 'DATE_ENVOI' :
                return 'date envoi'
            case 'HEURE_ENVOI' :
                return 'heure envoi'

            default :
                return libelle;
        }
    }
    constructor(private campagneService: CampagneService,
                @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private fb: FormBuilder) {
        if (data) {
            this.fomulaireDataItemId = data.details
            console.log("this.data : " + JSON.stringify(this.data))
            console.log("this.data.details : " + JSON.stringify(this.data.details))

            for (let detailFound of data.details) {

                let start = true;
                let isFoundStatut = true;
                detailFound.libelle = this.translateLibelle(detailFound.libelle).toUpperCase();
                console.log('details found : ' + JSON.stringify(detailFound))
                this.tab.push({libelle: detailFound.libelle, value: detailFound.valeur, isEditable: false});

                if (isFoundStatut) {
                    if (detailFound.libelle.toLowerCase() === FieldsToUpdate.STATUT) {

                        this.statut = detailFound.valeur;

                        if (
                             this.statut.toLocaleLowerCase().includes(FieldsToUpdate.STATUT_REJET)
                            || this.statut.toLocaleLowerCase().includes(FieldsToUpdate.STATUT_ECHOUE)
                            || this.statut.toLocaleLowerCase().includes(FieldsToUpdate.STATUT_ERREUR)
                            || this.statut.toLocaleLowerCase().includes(FieldsToUpdate.STATUT_ERROR)
                            || this.statut.toLocaleLowerCase().includes(FieldsToUpdate.STATUT_ECHOUE)
                            || this.statut.toLocaleLowerCase().includes(FieldsToUpdate.STATUT_VALIDE)) {
                            this.isEditable = data.enableEdit = false;
                        } else {
                            this.isEditable = data.enableEdit;

                        }
                        isFoundStatut = false;
                    }

                    if (start) {
                        if (detailFound.libelle.toLowerCase() === 'id') {
                            this.fomulaireDataItemId = detailFound.valeur;
                            start = false;
                        }
                    }
                }

                this.todayDate.setDate(this.todayDate.getDate() + 1);
                this.transitDetailFound = this.data.details.id;

                this.nomPartenaire = data.nomPartenaire;
                this.title = data.title;
                this.details = data.details;


                if (data.addSouscription) {
                    this.addSouscription = data.addSouscription;
                }
            }
        }
    }

    private getDetailsCampagneFieldUpdated(): DetailsCampagneFieldsToUpdate {
        // let realMonth_ = this.formUpdateDetailsCampagne.value.echeance.getMonth().toString().length > 1 ? (this.formUpdateDetailsCampagne.value.echeance.getMonth() + 1) : '0' + (this.formUpdateDetailsCampagne.value.echeance.getMonth() + 1);
        // let realDay_ = this.formUpdateDetailsCampagne.value.echeance.getDay().toString().length > 1 ? (this.formUpdateDetailsCampagne.value.echeance.getDay().toString() + 1) : '0' + (this.formUpdateDetailsCampagne.value.echeance.getDay().toString() + 1);

        const mapField = new Map<string, string>();
        // mapField.set('nom', this.formUpdateDetailsCampagne.value.nom);
        // mapField.set('prenom', this.formUpdateDetailsCampagne.value.prenom);
        // mapField.set('type', this.formUpdateDetailsCampagne.value.type);
        // mapField.set('telephone', this.formUpdateDetailsCampagne.value.telephone);
        // mapField.set('motif', this.formUpdateDetailsCampagne.value.motif);
        // mapField.set('email', this.formUpdateDetailsCampagne.value.email);
        // mapField.set('email', this.formUpdateDetailsCampagne.value.email);
        mapField.set('statut', this.statut);
        mapField.set('echeance', moment(this.formUpdateDetailsCampagne.value.echeance).format('DD-MM-YYYY'));

        return new DetailsCampagneFieldsToUpdate(this.fomulaireDataItemId, mapField);
    }

    ngOnInit() {
        if (localStorage.getItem('partner')) {
            let partner = localStorage.getItem('partner');
            this.nomPartenaire = partner.replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        }

    }

    private renderEditable() {
        this.isEditableConfirm = true;
        this.isEditable = false;
        this.formUpdateDetailsCampagne.controls['echeance'].setErrors({'incorrect': true})

        console.log('tab---- ' + JSON.stringify(this.tab))
        for (let i = 0; i < this.tab.length; i++) {
            switch (this.tab[i].libelle.toLowerCase()) {
                // case FieldsToUpdate.NOM:
                //     this.nom = this.tab[i].value;
                //     this.formUpdateDetailsCampagne.patchValue({nom: this.tab[i].value})
                //     this.tab[i].isEditable = true;
                //     break;
                // case FieldsToUpdate.PRENOM:
                //     this.prenom = this.tab[i].value;
                //     this.formUpdateDetailsCampagne.patchValue({prenom: this.tab[i].value})
                //     this.tab[i].isEditable = true;
                //     break;
                // case FieldsToUpdate.EMAIL:
                //     this.email = this.tab[i].value;
                //     this.formUpdateDetailsCampagne.patchValue({email: this.tab[i].value})
                //     this.tab[i].isEditable = true;
                //     break;
                // case FieldsToUpdate.TELEPHONE:
                //     this.telephone = this.tab[i].value;
                //     this.formUpdateDetailsCampagne.patchValue({telephone: this.tab[i].value})
                //     this.tab[i].isEditable = true;
                //     break;
                // case FieldsToUpdate.TYPE_IDENTITE:
                //     this.type = this.tab[i].value;
                //     this.formUpdateDetailsCampagne.patchValue({type: this.tab[i].value})
                //     this.tab[i].isEditable = true;
                //     break;
                // case FieldsToUpdate.MOTIF:
                //     this.motif = this.tab[i].value;
                //     this.formUpdateDetailsCampagne.patchValue({motif: this.tab[i].value})
                //     this.tab[i].isEditable = true;
                //     break;
                case FieldsToUpdate.STATUT:
                    // this.statut = this.tab[i].value;
                    console.log('statut value **************** ' + this.tab[i].value)
                    this.formUpdateDetailsCampagne.patchValue({statut: this.statut.value})
                    this.tab[i].isEditable = true;
                    break;
                case FieldsToUpdate.ECHEANCE:
                    this.echeance = new Date(this.tab[i].value).toDateString();
                    this.formUpdateDetailsCampagne.patchValue({echeance: moment(this.tab[i].value).format('DD-MM-YYYY')});
                    this.tab[i].isEditable = true;
                    break;
                default:
                    this.tab[i].isEditable = false;
                    break;
            }
        }
    }

    closeDialog(value) {
        this.dialogRef.close(value);
    }

    private enableEdit() {
        this.isEditable = true;
    }


    private confirmUpadte() {

        Swal.fire({
            title: 'Etes vous sûre de vouloir sauvegarder les modifications ! ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, confirmer !'
        }).then((result) => {

            console.log('retour from fire first : ' + JSON.stringify(result))

            if (result.isConfirmed) {
                this.campagneService.updateDetailsCampagne(this.getDetailsCampagneFieldUpdated()).subscribe((retour) => {
                        if (retour) {
                            swalWithBootstrapButtons.fire(
                                'Mise à jour reussie !',
                                'Les details ont été bien mis à jour .',
                                'success'
                            )
                            this.dialog.closeAll();
                        }
                    },
                    (err) => {

                        swalWithBootstrapButtons.fire(
                            'Cancelled',
                            'Mise à jour annulée !',
                            'error',
                            'danger'
                        )
                        this.dialog.closeAll();
                    });
            }
        });
    }


    private checkDateValidity($event) {
        let val = $event.target.value;
        console.log('date choisie  ' + val)
        console.log('today date  ' + this.today_)


        if (new Date() >= val) {
                this.formUpdateDetailsCampagne.controls['echeance'].setErrors({'incorrect': true})
                console.log('la date choisie est bien superieure à la date d\'aujourdhui')
            } else {

            console.log('la date choisie doit superieure à la date d\'aujourdhui')
            }
    }

}
