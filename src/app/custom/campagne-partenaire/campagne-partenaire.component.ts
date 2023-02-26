import {Component, OnInit} from '@angular/core';
import {Campagne} from '../../_model/campagne';
import {Constant} from '../../_constant/constant';
import {CampagneService} from '../../_service/autre/campagne.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {CommunService} from '../../_service/autre/commun.service';
import {DetailsCampagneListComponent} from '../details-campagne/details-campagne-list/details-campagne-list.component';
import {DetailsCampagneComponent} from '../details-campagne/details-campagne.component';
import {formatNumber} from '@angular/common';
import {Router} from '@angular/router';
import {UserService} from '../../_service/auth/user.service';
import any = jasmine.any;

@Component({
    selector: 'app-campagne-partenaire',
    templateUrl: './campagne-partenaire.component.html',
    styleUrls: ['./campagne-partenaire.component.scss']
})
export class CampagnePartenaireComponent implements OnInit {
    custombuttons = [
        {tag: 'details_campagne', title: 'Détails campagne', icon: 'fa fa-list'},
    ];
    fieldsForSearch;
    fieldsForFilter;
    campagnes:Campagne[];
    itemsPerPage = Constant.ITEMS_PER_PAGE;
    currentPage = Constant.CURRENT_PAGE;
    totalItems: number;
    selectedCampagne: Campagne;
    entities: any[];
    filtres: any[] = [];
    headers:any[];
    displayBoutton:boolean ;

    constructor(private campagneService: CampagneService,
                private userService:UserService,
                private communService:CommunService,
                private dialog: MatDialog,private route:Router) {
    }
    collecte() {
        this.route.navigate(['/campagnes/collecte/add']);
    }
    paiement() {
        this.route.navigate(['/campagnes/paiement/add']);
    }

    async ngOnInit() {
        this.fieldsForSearch = [
            {name: 'Nom', tag: 'nom', type: 'contains', level: 1},
            {name: 'Date', tag: 'date', type: 'contains', level: 2},
            {name: 'Type', tag: 'type', type: 'contains', level: 3},
            {name: 'Code partenaire', tag: 'esp', type: 'in', level: 4},
            {name: 'Statut', tag: 'status', type: 'in', level: 5},
            {name: 'Nom Partenaire', tag: 'partenaire', type: 'contains', level: 6}
        ];

        this.fieldsForFilter = [
            {
                name: 'Code partenaire',
                tag: 'esp',
                type: 'in',
                onGetFieldOptions: () => {
                    return this.communService.getCodePartenaires().toPromise().then(
                        (resp: any[]) => {
                            return resp;
                        }
                    )
                }
            },
            {
                name: 'Statut',
                tag: 'status',
                type: 'in',
                onGetFieldOptions: () => {
                    return this.communService.getStatutsCampagne().toPromise().then(
                        resp => {
                            return resp;
                        }
                    )
                }
            }
        ];

        this.getCampagnes(this.currentPage);
    }

    getCampagnes(page, items =  this.itemsPerPage, filters = [], exporter = false) {
        console.log('++++++++++ In Get All Campagnes ++++++++++++')
        this.filtres = filters;
        this.currentPage = page;
        this.entities = [];
        this.itemsPerPage = items;
        this.headers=[];
        this.campagneService.findAllCampagnePartenaires(this.currentPage, this.itemsPerPage, filters).toPromise()
            .then((result) => {
                if (result) {
                    console.log('****** Result findAllCampagnePartenaire : ')
                    console.log('NomPartenaire',JSON.stringify(result));
                    this.campagnes = result.data;
                    this.totalItems = result.totalItems;
                    if (this.campagnes) {
                        for (const item of this.campagnes) {
                            let background = '';
                            let color = '';
                            if(item.status === 'INITIE') { background  = '#bfdbfe';color='#2563eb' }
                            if (item.status === 'ENVOYE') { background  = '#bfdbfe';color='#2563eb' }
                            if (item.status === 'PARTIEL') { background = '#fef08a'; color='#ca8a04'}
                            if (item.status === 'ATTENTE_VALIDATION') { background = '#e5e7eb';color='#4b5563' }
                            if (item.status === 'ATTENTE_ENVOI') { background = '#e5e7eb';color='#4b5563' }
                            if (item.status === 'EN ATTENTE') { background = '#e5e7eb';color='#4b5563' }
                            if (item.status === 'REJETE') { background = '#fecaca'; color='#dc2626'}
                            if (item.status === 'EXPIRE') { background = '#fef08a';color='#ca8a04' }
                            if (item.status === 'SOLDE') { background   = '#bbf7d0';color='#16a34a' }
                            if (item.status === 'ERROR' || item.status === 'ERREUR'  || item.status === 'ECHOUE') { background   = '#fecaca';color='#dc2626' }
                            console.log('montant Total : '+item.montantTotal)
                            console.log('montant frais : '+item.fraisTotal)
                            console.log('************** item : ' + JSON.stringify(item) )

                            localStorage.setItem('partner',JSON.stringify(item.partner)) ;

                           if (this.userService.isSuperAdmin() || this.userService.isAdmin()){
                                 console.log("No entree***");
                                 this.headers = ['Sous Canal','Type','Nom','Code Partenaire','Nom Partenaire','Date', 'Statut', 'Montant Total' ];
                               this.entities.push({
                                   object: item,
                                   values: [
                                       item.canal,
                                       item.type,
                                       item.nom,
                                        item.esp,
                                       {type: 'partner', value: item.partner},
                                       item.date,
                                       {type: 'statut', statut: item.status, background: background, color:color},
                                       {type: 'montant', typeservice: item.type, value:(item.montantTotal + item.fraisTotal) !== 0 ? formatNumber(item.montantTotal + item.fraisTotal, 'fr-FR') : 'N/A'},
                                   ]
                               });
                           }
                             else {
                               console.log("With Entree***");
                              this.headers = ['Sous Canal', 'Nom', 'Date', 'Statut', 'Montant Total'];
                               this.entities.push({
                                   object: item,
                                   values: [
                                       item.canal,
                                     // item.type,
                                       item.nom,
                                       //item.esp,
                                      // {type: 'partner', value: item.partner},
                                      item.date,
                                       {type: 'statut', statut: item.status, background: background, color:color},
                                       {type: 'montant', typeservice: item.type, value:(item.montantTotal + item.fraisTotal) !== 0 ? formatNumber(item.montantTotal + item.fraisTotal, 'fr-FR') : 'N/A'},
                                       // item.typeCanal,
                                       // tslint:disable-next-line:max-line-length
                                   ]
                               });
                           }

                            console.log('+++++++++++++++Entities tab containt :' );
                            console.log(JSON.stringify(this.entities));
                        }
                    }
                    if (exporter) {
                        this.communService.exporter(this.entities, 'campagnes');
                    }
                    if (exporter || items == null) {
                        this.currentPage = 1;
                        this.itemsPerPage = 10;
                    }
                }
            });

    }

    onDetails(campagne: Campagne) {

        console.log("campagne" + JSON.stringify(campagne));
        this.dialog.open(ShowDetailComponent, {
            data: {
                title: 'Détail campagne',
                enableEdit: false,
                details: [
                    {libelle: 'Nom', valeur: campagne.nom},
                    {libelle: 'Statut', valeur: campagne.status},
                    {libelle: 'Type', valeur: campagne.type},
                    // {libelle: 'Type Canal', valeur: campagne.typeCanal ? campagne.typeCanal: 'NEANT'},
                    {libelle: 'Sous Canal', valeur: campagne.canal ? campagne.canal :'NEANT'},
                    {libelle:'Nom Partenaire', valeur: campagne.partner},
                    // tslint:disable-next-line:max-line-length
                    {libelle: 'Montant Total', valeur: (campagne.montantTotal + campagne.fraisTotal) !== 0 ? formatNumber(campagne.montantTotal + campagne.fraisTotal, 'fr-FR') : 'N/A'},
                ]
            }

        });

    }

    onEdit(campagne: Campagne) {
        this.selectedCampagne = campagne;
        this.openEditDialog();
    }

    openEditDialog() {
        let tag;
        let title;

        if (this.selectedCampagne == null) {
            tag = 'add';
            title = 'Ajouter campagne';
            this.selectedCampagne = new Campagne();
        } else {
            tag = 'edit';
            title = 'Modifier campagne';
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '500px';
        dialogConfig.data = {
            title,
            entity: this.selectedCampagne,
            fields: [
                {label: 'Nom', tag: 'nom', type: 'text', valeur: this.selectedCampagne.nom, required: true}
            ],
            validate: (entity: Campagne) => {
                console.log('___ to edit ___');
                console.log(entity);

                this.selectedCampagne.nom = entity.nom;

                if (tag === 'edit') {
                    return this.campagneService.edit(this.selectedCampagne).toPromise()
                        .then(
                            (org) => {
                                console.log('____ Campagne edited ___');
                                console.log(org);
                                return org;
                            },
                            (error) => {
                                console.log('___ Error edit campagne ___');
                                console.log(error);
                                return error;
                            }
                        );
                }
            }
        };

        this.dialog.open(EditEntityComponent, dialogConfig)
            .afterClosed().subscribe((result) => {
            console.log('____ Edit and close dialog campagne ___');
            console.log(result);
            if (result && result.submit) {
                this.getCampagnes(this.currentPage);
            }
        });
    }

    onDelete(campagne: Campagne) {
        this.dialog.open(ConfirmDeleteComponent, {
            data: {
                message: 'Vous allez supprimer ce campagne?',
                fields: [
                    {label: 'Campagne', valeur: campagne.nom}
                ]
            }
        }).afterClosed().subscribe(result => {
            if (!result.canceled) {
                this.campagneService.delete(campagne)
                    .subscribe(
                        (resp) => {
                            console.log('___ Campagne deleted ___');
                            console.log(resp);

                            this.getCampagnes(this.currentPage);
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

        //alert("avnt detais campagne");

        console.log('___ Custom button ___');
        console.log(event);
        const tag = event.tag;
        const campagne: Campagne = event.entity;
        console.log('___ campagne : ___ ', campagne);
        localStorage.setItem("typeCanalChoosen",campagne.typeCanal)


        switch (tag) {
            case 'details_campagne':
                this.dialog.open(DetailsCampagneComponent, {
                    data: {
                        campagne: campagne,
                        isDialog: true
                    }
                });
                break;
            default:
                break;
        }
    }

    exporter(filtres) {
        console.log("filtres",filtres)
        this.getCampagnes(null, null, filtres, true)
    }
}
