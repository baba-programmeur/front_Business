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
import {formatNumber} from '@angular/common';

declare var swal;

@Component({
    selector: 'app-campagne-validation',
    templateUrl: './campagne-validation.component.html',
    styleUrls: ['./campagne-validation.component.scss']
})
export class CampagneValidationComponent implements OnInit {
    custombuttons = [
        {tag: 'details_campagne', title: 'Détails campagne', icon: 'fa fa-list'},
        {tag: 'validation_campagne', title: 'Validation campagne', icon: 'fa fa-check'},
    ];

    headers = ['ID', 'Nom', 'Statut', 'Date', 'Type', 'Montant Total', 'Code partenaire'];
    fieldsForSearch;
    fieldsForFilter;

    campagnes: Campagne[];
    itemsPerPage = Constant.ITEMS_PER_PAGE;
    currentPage = Constant.CURRENT_PAGE;
    totalItems: number;
    selectedCampagne: Campagne;
    entities: any[];
    filtres: any[] = [];

    constructor(private campagneService: CampagneService,
                private communService: CommunService,
                private dialog: MatDialog) {
    }

    async ngOnInit() {
        this.fieldsForSearch = [
            {name: 'ID', tag: 'id', type: 'in', level: 1},
            {name: 'Nom', tag: 'nom', type: 'contains', level: 2},
            {name: 'Date', tag: 'date', type: 'contains', level: 3},
            {name: 'Type', tag: 'type', type: 'contains', level: 4},
            {name: 'Code partenaire', tag: 'esp', type: 'in', level: 5},
            {name: 'Statut', tag: 'status', type: 'in', level: 6},
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

    getCampagnes(page, filters = [], exporter = false) {
        this.filtres = filters;
        this.currentPage = page;
        this.entities = [];
        if (page == null) {
            this.itemsPerPage = null;
        }

        this.campagneService.findAllCampagnePartenairesOnPending(this.currentPage, this.itemsPerPage, filters).toPromise()
            .then((result) => {
                if (result) {
                    console.log('Liste des campagnes : ', result);
                    this.campagnes = result.data;
                    this.totalItems = result.totalItems;
                    if (this.campagnes) {
                        for (const item of this.campagnes) {
                            let background = '';
                            if (item.status === 'EN ATTENTE') background = 'gray';
                            console.log('****** Montant : ');
                            console.log(item);
                            console.log('****** Montant Frais: '+item.fraisTotal);
                            this.entities.push({
                                object: item,
                                values: [
                                    {type: 'id', 'id': item.id},
                                    item.nom,
                                    {type: 'statut', statut: item.status, background: background},
                                    item.date,
                                    item.type,
                                    // tslint:disable-next-line:max-line-length
                                    (item.montantTotal + item.fraisTotal) !== 0 ? formatNumber(item.montantTotal + item.fraisTotal, 'fr-FR') : 'N/A',
                                    item.esp
                                ]
                            });
                        }
                        if (exporter) {
                            this.communService.exporter(this.entities, 'campagnes validation')
                        }
                    }
                    if (exporter || page == null) {
                        this.currentPage = 1;
                        this.itemsPerPage = 10;
                    }
                }
            });

    }

    onDetails(campagne: Campagne) {
        console.log(campagne);
        this.dialog.open(ShowDetailComponent, {
            data: {
                title: 'Détail campagne',
                details: [
                    {libelle: 'Nom', valeur: campagne.nom},
                    {libelle: 'Statut', valeur: campagne.status},
                    {libelle: 'Type', valeur: campagne.type},
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
        console.log('___ Custom button ___');
        console.log(event);
        const tag = event.tag;
        const campagne: Campagne = event.entity;

        switch (tag) {
            case 'details_campagne':
                this.dialog.open(DetailsCampagneListComponent, {
                    data: {
                        campagne: campagne,
                        isDialog: true
                    }
                });
                break;
            case 'validation_campagne':
                this.dialog.open(ConfirmDeleteComponent, {
                    data: {
                        title: 'Validation',
                        message: 'Vous allez effectuer une action sur la présente campagne?',
                        cancelBtn: 'Rejeter',
                        confirmBtn: 'Valider',
                        fields: [
                            {label: 'Campagne', valeur: campagne.nom}
                        ]
                    }
                }).afterClosed().subscribe(result => {
                    if (!result.canceled) {
                        console.log("********* Valider Campagne *********");
                        this.campagneService.valider(campagne.id, 'v').toPromise()
                            .then(
                                (data) => {
                                    console.log("****** In Vaidler then ******");
                                    swal({
                                        icon: 'success',
                                        text: 'Validation campagne effectuée avec succès'
                                    });
                                     this.getCampagnes(this.currentPage);
                                }
                            );
                    } else {
                        this.campagneService.valider(campagne.id, 'r').toPromise()
                            .then(
                                (data) => {
                                    swal({
                                        icon: 'success',
                                        text: 'Rejet campagne effectué avec succès'
                                    });
                                    this.getCampagnes(this.currentPage);
                                }
                            );
                    }
                });
                break;
            default:
                break;
        }
    }

    getAllCampagnes(filtres: any[]) {
        this.getCampagnes(null, filtres, true);
    }
}
