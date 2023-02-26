import {Component, Inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DetailCampagne} from '../../_model/detail-campagne';
import {Constant} from '../../_constant/constant';
import {Campagne} from '../../_model/campagne';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {DetailCampagneService} from '../../_service/autre/detail-campagne.service';
import {CommunService} from '../../_service/autre/commun.service';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {DetailsCampagneListComponent} from './details-campagne-list/details-campagne-list.component';
import {ConfirmComponent} from '../global/confirm/confirm.component';
import {type} from 'os';
import {CampagneService} from '../../_service/autre/campagne.service';
import {FormulaireData} from '../../_model/formulaire-data';
import {FormulaireService} from '../../_service/autre/formulaire.service';
import {SouscriptionService} from '../../_service/autre/souscription.service';
import {FileService} from '../../_service/autre/file.service';
import {formatNumber} from '@angular/common';

declare var swal;

@Component({
    selector: 'app-details-campagne',
    templateUrl: './details-campagne.component.html',
    styleUrls: ['./details-campagne.component.scss']
})
export class DetailsCampagneComponent implements OnInit, OnChanges {
    headers = [];
    custombuttons = [
        /*
            {tag: 'renvoyer', title: 'Renvoyer', icon: 'fa fa-paper-plane'},
            {tag: 'annuler', title: 'Annuler', icon: 'fa fa-check'},
            {tag: 'activer', title: 'Activer/Désactiver', icon: 'fa fa-remove'},
        */
    ];
    fieldsForSearch;
    fieldsForFilter;
    itemsPerPage = Constant.ITEMS_PER_PAGE;
    currentPage = Constant.CURRENT_PAGE;
    isDialog = false;
    selectedDetailCampagne: any;
    entities: any[];
    @Input()
    details: any[];
    filtres: any[];
    @Input()
    campagne: Campagne;
    @Input()
    typeCampagne: string;
    @Input()
    totalItems: number;
    static canalLibelle_:string;
    typeCanalChoosen_ ?: string;

    constructor(private detailcampagneService: DetailCampagneService,
                private dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private formulaireService: FormulaireService,
                private campagneService: CampagneService,
                private souscriptionService: SouscriptionService,
                private communService: CommunService) {
        if (data && data.campagne) {

            console.log("welcome detailCampagne " + JSON.stringify(data.campagne))

            this.campagne = data.campagne;
            this.typeCampagne = this.campagne.type;
            this.totalItems = 1;
            this.isDialog = true;
        }
    }

    ngOnInit() {
        console.log('___ Total items', this.totalItems);
        console.log('___ Current Page', this.currentPage);
        console.log('___ Items Per Page', this.itemsPerPage);
        this.fieldsForSearch = [
            {name: 'Id client', tag: 'idclient', type: 'in', level: 1},
            {name: 'Prénom', tag: 'prenom', type: 'contains', level: 2},
            {name: 'Nom', tag: 'nom', type: 'contains', level: 3},
            {name: 'Montant', tag: 'montant', type: 'in', level: 4},
            {name: 'Numéro GSM', tag: 'telephone', type: 'contains', level: 5},
            {name: 'Code (MAD)', tag: 'code', type: 'contains', level: 6},
            {name: 'Date d\'expiration', tag: 'echeance', type: 'in', level: 7},
            {name: 'Statut', tag: 'statut', type: 'in', level: 8},
        ];
        this.fieldsForFilter =  [
            {
                name: 'Statut',
                tag: 'statut',
                type: 'in',
                onGetFieldOptions: () => {
                    return this.communService.getStatutsDetailsCampagne().toPromise().then(
                        resp => {
                            return resp;
                        }
                    )
                }
            },
        ];

        if (this.details) {
            this.detailsToEntities(this.details);
        } else {
        this.getDetailCampagnes(this.currentPage, this.itemsPerPage, this.campagne);
        }
    }

    /**
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        console.log('___ changes');
        console.log(changes);

        /*
        if (changes.details && changes.details.currentValue) {
            console.log(changes.details.currentValue);
            this.details = changes.details.currentValue;
            this.currentPage = Constant.CURRENT_PAGE;
            this.itemsPerPage = Constant.ITEMS_PER_PAGE;
            this.getDetailCampagnes(this.currentPage, this.itemsPerPage, this.campagne);
        }
        */

        if (changes.typeCampagne && changes.typeCampagne.currentValue) {
            this.typeCampagne = changes.typeCampagne.currentValue;
        }

        if (changes.totalItems && changes.totalItems.currentValue) {
            this.totalItems = changes.totalItems.currentValue;
        }
    }



    /**
     * Get details for campagne
     *
     * @param page
     * @param campagne
     * @param filtres
     */
    getDetailCampagnes(page, size, campagne, filtres = null) {
        console.log('Details Campagne pour voir')
        console.log("******** In getDetailCampagnes()")
        this.totalItems = null;
        this.filtres = filtres;

        this.currentPage = page;
        this.itemsPerPage = size;

        this.entities = [];

        console.log('---------- Les filtres ---------------');
        console.log(filtres);

        this.typeCanalChoosen_ = localStorage.getItem("typeCanalChoosen");
        console.log('typeCanalChoosen_ _________',this.typeCanalChoosen_);

        console.log("typeCanalChoosen_ from localStorage___" , this.typeCanalChoosen_)
        this.campagneService.getDetails(this.typeCanalChoosen_,campagne.id, page, size, filtres).toPromise()
            .then((result) => {
                if (result) {
                    console.log('------------ La liste des détails campagnes -----------');
                    console.log(result);
                    console.log('commentaireresult',result.data)
                    this.totalItems = +result.totalItems;
                    this.details = result.data;
                    this.details['partner'] =campagne.partner;
                    console.log('------------ La liste des détails :');
                    console.log(this.details);
                    console.log("from getDetailsCampagne ________ ",this.typeCanalChoosen_)

                    if(this.typeCanalChoosen_.toLowerCase() === 'wallet'){
                        this.details.forEach((detail)=>{
                            console.log("statut _________ ", detail.statut);
                            if(detail.statut){
                                detail.statut = this.campagneService.translateStatus(detail.statut);
                                console.log("statut retourner par this _________ ", detail.statut);
                            }
                        })
                    }
                    

                    console.log('------------ La liste des détails after tranlate statut:');
                    console.log(this.details);

                        
                  // console.log("Entite",this.entities)
                    // this.details = this.filterDetailsCampagne(filtres, this.details);
                    this.detailsToEntities(this.details);
                    if (size == null) {
                        this.currentPage = 1;
                        this.itemsPerPage = 10;
                    }
                    console.log('------------ La liste des détails after detailsToEntities:');
                    console.log(this.details);

                    console.log('___ current page : ', this.currentPage);
                    console.log('___ totalItems : ', this.totalItems);
                }
            });
    }

    getTransactions(campagne, filtres = null, exporter = false) {
        this.filtres = filtres;

        this.entities = [];

        console.log('--------campagne infos--------------',this.campagne.typeCanal);
        console.log('---------- Les filtres ---------------');
        console.log(filtres);

        this.campagneService.getTransactions(this.campagne.typeCanal,campagne.id, filtres).toPromise()
            .then((result) => {
                if (result) {
                    console.log('------------ La liste des transactions -----------');
                    console.log(result);
                    this.details = result.data;

                    console.log("_______this.details from result" , this.details)
                    
                    this.detailsToEntities(this.details);
                    if (exporter) {
                        console.log(this.entities);
                        this.communService.exporter(this.entities, 'details-campagnes')
                    }
                }
            });
    }

    /**
     *
     * @param filtres
     * @param details
     */
    filterDetailsCampagne(filtres: any[], details): any[] {
        const filtered_details: any[] = [];
        console.log(filtres);
        if (filtres) {
            for (const filtre of filtres) {
                details = details.filter(detail => detail[filtre.tag].toLowerCase().indexOf(filtre.value.toLowerCase()) === 0)
            }
        }
        return details;
    }

    /**
     * @param details
     */
    detailsToEntities(details) {
        console.log("****** In detailsToEntities ");
        console.log("****** details :  ");
        console.log("****** details.partner :  " , localStorage.getItem("partner"));
        console.log("****** typeCanalChoosen :  " , localStorage.getItem("typeCanalChoosen"));

        this.typeCanalChoosen_ = localStorage.getItem("typeCanalChoosen");
        console.log("****** this.canalChosen :  " , this.typeCanalChoosen_);

        console.log(details);

        details.partner = localStorage.getItem("partner");


        this.entities = [];


        if (this.campagne.type.toLowerCase() === 'encaissement') {
            this.headers = ['idclient', 'prenom', 'nom', 'montant', 'telephone', 'code', 'echeance', 'statut', 'date','Nom Partenaire'];
        }else if(this.campagne.type.toLowerCase() === 'decaissement' && this.typeCanalChoosen_.toLowerCase() === 'wallet') {
            this.headers = ['idclient', 'prenom', 'nom','type Canal','sous canal','message erreur' ,'montant', 'frais', 'telephone', 'statut', 'date','Nom Partenaire'];
        }
        // else if(this.campagne.type.toLowerCase() === 'decaissement' && this.typeCanalChoosen_.toLowerCase() === 'wallet') {
        //     this.headers = ['idclient', 'prenom', 'nom','type Canal','sous canal','message erreur' ,'montant', 'frais', 'telephone', 'statut', 'date','Nom Partenaire'];
        // }
        else if(this.campagne.type.toLowerCase() === 'decaissement'){
            this.headers = ['idclient', 'prenom', 'nom','type Canal','sous canal' ,'montant', 'frais', 'telephone', 'statut', 'date','Nom Partenaire'];
        }else {
            this.headers = ['idclient', 'prenom', 'nom','type Canal','sous canal', 'montant', 'telephone', 'code', 'echeance', 'statut', 'date','Nom Partenaire'];
        }

        // tslint:disable-next-line:triple-equals
        if (details && details.length != 0) {
            // const first: Object = details[0];
            // this.headers = Object.keys(first);

            // if(this.typeCanalChoosen_.toLowerCase() === 'wallet'){
            //     details.forEach((detail)=>{
            //         console.log("statut _________ ", detail.statut);
            //         if(detail.statut){
            //             detail.statut = this.campagneService.translateStatus(detail.statut);
            //             console.log("statut retourner par this _________ ", detail.statut);
            //         }
            //     })
            // }
            
            for (const item of details) {
                const values = [];
                // values.push("OK");
                for (const key of this.headers) {
                    if (key.toLowerCase() === 'statut') {
                        console.log("------ item[key] --------",item[key]);
                        console.log("------ !(this.campagne.typeCanal.toLowerCase() === 'wallet') --------");
                        let statut = '';
                        let background = '';
                        let color = '';
                        if (item[key] === 'initie' || item[key].toLocaleLowerCase() === 'i') {
                            statut = 'INITIE';
                            background = '#bfdbfe';
                            color ='#2563eb';
                        } else if (item[key] === 'envoye') {
                            statut = 'ENVOYE';
                            background = '#bfdbfe';
                            color ='#2563eb';
                        } else if (item[key] === 'partiel') {
                            statut = 'PARTIEL';
                            background = '#fef08a';
                            color ='#ca8a04';
                        }
                        else if (item[key] === 'attente_validation') {
                            statut = 'ATTENTE_VALIDATION';
                            background = '#e5e7eb';
                            color ='#4b5563';
                        }
                        else if (item[key] === 'attente_envoi') {
                            statut = 'ATTENTE_ENVOI';
                            background = '#e5e7eb';
                            color ='#4b5563';
                        }else if (item[key] === 'expire' || item[key].toLocaleLowerCase() === 'x') {
                            statut = 'EXPIRE';
                            background = '#fef08a';
                            color ='#ca8a04';
                        } else if (item[key] === 'valide' || item[key].toLocaleLowerCase() === 't') {
                            statut = 'VALIDE';
                            background = '#bbf7d0';
                            color ='#16a34a';
                        } else if (item[key] === 'erreur' || item[key] === 'bloque' || item[key].toLocaleLowerCase() === 'r') {
                            statut = 'ECHOUE';
                            background = '#fecaca';
                            color ='#dc2626';
                        } else if (item[key] === 'rejete') {
                            statut = 'REJETE';
                            background = '#fecaca';
                            color ='#dc2626';
                        } else if (item[key] === 'en attente' || item[key].toLocaleLowerCase() === 'u'|| item[key].toLocaleLowerCase() === 'a') {
                            statut = 'EN ATTENTE';
                            background = '#e5e7eb';
                            color ='#4b5563';
                        }else if (item[key] === 'en cours') {
                            statut = 'EN COURS';
                            background = '#e5e7eb';
                            color ='#4b5563';
                        }else if (item[key] === 'get') {
                            statut = 'EN COURS';
                            background = '#e5e7eb';
                            color ='#4b5563';
                        }
                        
                        values.push({type: 'statut', statut: statut, background: background, color:color})
                    }
                    else {
                        if (key.toLowerCase() === 'idclient') {
                            values.push({type: 'id', 'id': item[key]});
                        }else {
                            if (key.toLowerCase() === 'montant' || key.toLowerCase() === 'frais') {
                                values.push(formatNumber(item[key], 'fr-FR'));
                            } else if (key ==='Nom Partenaire') {
                                values.push(details.partner.replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''));
                            } else {
                                
                                if(key === 'type Canal'){
                                    values.push(this.campagne.typeCanal);
                                }else if(key === 'sous canal'){
                                    values.push(this.campagne.canal);
                                }
                                else if(key === 'message erreur' && this.typeCanalChoosen_.toLowerCase() === 'wallet' ){
                                    console.log("_message retour condition ______ item ", item);

                                    if(item['messageRetour']){
                                        console.log("______________ if item['messageRetour']");
                                        values.push({type: 'message', value: item['messageRetour']});
                                        console.log("_______ value send ", values);
                                    }
                                    // else{

                                    //     console.log("______________ if item['messageRetour'] === null" )
                                    //     values.push({type: 'no_message', value: 'ffff'});
                                    // }
                                   
                                }
                                else{
                                    values.push(item[key]);
                                }
                            }
                        }
                    }
                }
                
                this.entities.push({object: item, values});
                console.log("this.entities ------ " + JSON.stringify(this.entities))

            }
        }
    }

    onDetails(detailCampagne: any) {

        console.log('___ from onDetails ___');
        
        console.log("this.details " + JSON.stringify(this.details));
        // const tag = this.details.tag;
        // const detail: any = this.details.entity;

        // console.log("this.details " +this.details)

        console.log('___ end from  onDetails ___');

        console.log('_______________ DETAILS CAMPAGNE DETAILS _______________');
        console.log('detailCampagne ________________ ' + JSON.stringify(detailCampagne));

        detailCampagne['type canal'] = this.campagne.typeCanal;
        detailCampagne['sous canal'] = this.campagne.canal;

        const head = Object.keys(detailCampagne);

        const details = [];
        for (const h of head) {
            console.log("head " + h)
            // tslint:disable-next-line:triple-equals
            if (h != 'notif_sms' && h != 'notif_email') {
                // tslint:disable-next-line:max-line-length
                if (h === 'code'  && detailCampagne['statut'] !== 'en attente' && detailCampagne['statut'] !== 'attente_validation' && detailCampagne['statut'] !== 'attente_envoi'  && detailCampagne['statut'] !== 'initie') {
                    details.push(
                        {
                            libelle: h.toUpperCase(),
                            valeur: detailCampagne[h]
                        }
                    )
                } else {
                    if (h !== 'code') {
                        details.push(
                            {
                                libelle: h.toUpperCase(),
                                valeur: detailCampagne[h],
                              //  nomP:details.partner
                            }
                        )
                    }else{
                        details.push(
                            {
                            libelle: h.toUpperCase(),
                            valeur: detailCampagne[h]
                          //  nomP:details.partner
                         }
                    )}
                }
            }
        }


        this.dialog.open(ShowDetailComponent, {
            width: '600px',
            data: {
                title: 'Détails campagne',
                enableEdit: true,
                details: details
            }
        });
    }

    onEdit(detailCampagne: any) {
        this.selectedDetailCampagne = detailCampagne;
        console.log('Details campagne à modifier');
        console.log(detailCampagne);
        if (detailCampagne.statut === 'valide') {
            swal({
                icon: 'warning',
                text: 'Attention cette transaction a été validé.'
            });
        } else {
            if (detailCampagne.statut === 'rejete') {
                swal({
                    icon: 'warning',
                    text: 'Attention cette transaction a été rejeté.'
                });
            } else {
                this.openEditDialog();
            }
        }
    }

    openEditDialog() {
        this.formulaireService.findFormulaireDetails(this.typeCampagne.toLowerCase()).toPromise()
            .then(
                (detailsForm: any) => {
                    console.log(this.typeCampagne);
                    console.log(detailsForm);

                    // Update for details campagne add/edit
                    const champsDetails = [];

                    for (const formDataDetails of detailsForm.formulaireItems) {
                        for (const formChampsDetails of formDataDetails.champs) {
                            // tslint:disable-next-line:triple-equals max-line-length
                            if (formChampsDetails.visible && formChampsDetails.slug != 'notif_sms' && formChampsDetails.slug != 'notif_email') {
                                champsDetails.push(formChampsDetails);
                            }
                        }
                    }
                    const fieldsDetails = [];
                    for (const fieldChamp of champsDetails) {
                        if (fieldChamp.type === 'select') {
                            const opts = [];
                            for (const opt of JSON.parse(fieldChamp.optionsValue)) {
                                opts.push(
                                    {
                                        label: opt.label,
                                        value: opt.valeur
                                    }
                                );
                            }

                            fieldsDetails.push(
                                // tslint:disable-next-line:max-line-length
                                {
                                    label: fieldChamp.label,
                                    tag: fieldChamp.slug,
                                    type: fieldChamp.type,
                                    valeur: this.selectedDetailCampagne[fieldChamp.slug],
                                    required: true,
                                    options: opts
                                },
                            );
                        } else {
                            fieldsDetails.push(
                                // tslint:disable-next-line:max-line-length
                                {
                                    label: fieldChamp.label,
                                    tag: fieldChamp.slug,
                                    type: fieldChamp.type,
                                    valeur: this.selectedDetailCampagne[fieldChamp.slug],
                                    required: true
                                },
                            );
                        }
                    }
                    const dialogConfig = new MatDialogConfig();
                    dialogConfig.width = '500px';
                    dialogConfig.data = {
                        title: 'Modifier detailCampagne',
                        entity: this.selectedDetailCampagne,
                        fields: fieldsDetails,
                        validate: (entity: any) => {
                            entity.id = this.selectedDetailCampagne.id;
                            entity.reference = this.campagne.id;
                            entity.echeance = FileService.formatDate(entity.echeance);
                            console.log('---------- Entity à enregistrer -----');
                            console.log(entity);
                            return this.souscriptionService.updateFormulaireData(entity, this.typeCampagne).toPromise()
                                .then(
                                    (org) => {
                                        return org;
                                    },
                                    (error) => {
                                        return error;
                                    }
                                );
                        }
                    };

                    this.dialog.open(EditEntityComponent, dialogConfig)
                        .afterClosed().subscribe((result) => {
                        if (result && result.submit) {
                            this.getDetailCampagnes(this.currentPage, this.itemsPerPage, this.campagne);
                        }
                    })
                });
    }

    onDelete(detailCampagne: DetailCampagne) {
        const montant = +detailCampagne.mnt;

        this.dialog.open(ConfirmDeleteComponent, {
            data: {
                message: 'Vous allez supprimer ce detailCampagne?',
                fields: [
                    {label: 'Id Client', valeur: detailCampagne.idclt},
                    {label: 'Prénom', valeur: detailCampagne.prenomclt},
                    {label: 'Nom', valeur: detailCampagne.nomclt},
                    {label: 'Montant', valeur: montant.toLocaleString('fr-FR')},
                ]
            }
        }).afterClosed().subscribe(result => {
            if (!result.canceled) {
                this.detailcampagneService.delete(detailCampagne)
                    .subscribe(
                        (resp) => {
                            this.getDetailCampagnes(this.currentPage, this.itemsPerPage, this.campagne);
                        }
                    );
            }
        });
    }

    /**
     * Gestion boutons supplément dans la liste
     *
     * @param event
     */
    onCustomButton(event) {
        // Mise en place de la gestion des boutons customisés
        console.log('********___ Custom button ___');

        console.log(event);
        const tag = event.tag;
        const detail: any = event.entity;

        console.log("real entity " + JSON.stringify(detail))

        const typeCode = (this.typeCampagne === 'DECAISSEMENT') ? 'retrait' : 'paiement';

        switch (tag) {
            case 'renvoyer':
                console.log('Transaction à renvoyer');
                console.log(detail);
                if (detail.statut === 'erreur' || detail.statut === 'initie' || detail.statut === 'bloque') {
                    this.dialog.open(ConfirmComponent, {
                        data: {
                            message: 'Générer et envoyer le code de ' + typeCode + ' au client?',
                            fields: []
                        }
                    }).afterClosed().subscribe(result => {
                        if (!result.canceled) {
                            /*this.detailcampagneService.sendCode(detail)
                                .subscribe(
                                    resp => {
                                        console.log('__ Le code est renvoyé');
                                        swal({
                                            icon: 'success',
                                            text: 'Code renvoyé avec succès'
                                        })
                                    }
                                )*/
                        }
                    });
                } else {
                    swal({
                        icon: 'warning',
                        text: 'Vous ne pouvez pas renvoyer cette transaction'
                    })
                }
                break;
            case 'annuler':
                if (detail.statut === 'annule') {
                    swal({
                        icon: 'warning',
                        text: 'Cette transaction est déja annulé'
                    })
                } else {
                    if (detail.statut !== 'valide') {
                        // TODO: opération d'annulation ici
                    } else {
                        swal({
                            icon: 'warning',
                            text: 'Vous ne pouvez pas annulé un code déja payé'
                        })
                    }
                }
                break;
            case 'activer':
                if (detail.statut === 'annule') {
                    swal({
                        icon: 'warning',
                        text: 'Impossible d\'activer un code déjà annulé'
                    })
                } else {
                    if (detail.statut !== 'valide') {
                        if (detail.statut === 'desactive') {

                        } else {

                        }
                    } else {
                        swal({
                            icon: 'warning',
                            text: 'Vous ne pouvez pas activer ou désactiver un code déja payé'
                        })
                    }
                }
                break;
            default:
                break;
        }
    }

    close() {
        this.dialog.closeAll();
    }

    getAllDetailCampagnes(campagne: Campagne, filtres: any[]) {
        console.log("filtre from details-campagne _______",JSON.stringify(filtres))
        console.log("filtre from details-campagne _______",JSON.stringify(campagne))

        this.getTransactions(campagne, filtres, true);
    }
}
