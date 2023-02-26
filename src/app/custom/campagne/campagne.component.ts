import {Component, OnInit} from '@angular/core';
import {Campagne} from '../../_model/campagne';
import {Constant} from '../../_constant/constant';
import {CampagneService} from '../../_service/autre/campagne.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {CommunService} from '../../_service/autre/commun.service';
import {DetailsCampagneComponent} from '../details-campagne/details-campagne.component';
import {PaysService} from '../../_service/autre/pays.service';
import {formatNumber} from '@angular/common';

@Component({
    selector: 'app-campagne',
    templateUrl: './campagne.component.html',
    styleUrls: ['./campagne.component.scss']
})
export class CampagneComponent implements OnInit {
    custombuttons = [
        {tag: 'details_campagne', title: 'Détails campagne', icon: 'fa fa-list'},
    ];

    headers = ['Filiale', 'Code partenaire', 'Nom', 'Montant Total', 'Date', 'Type', 'Statut'];
    fieldsForSearch;
    fieldsForFilter;

    campagnes: Campagne[];
    itemsPerPage = Constant.ITEMS_PER_PAGE;
    currentPage = Constant.CURRENT_PAGE;
    totalItems: number;
    selectedCampagne: Campagne;
    entities: any[];
    filtres: any[] = [];
    pays = [];

    constructor(private campagneService: CampagneService,
                private communService: CommunService,
                private paysService: PaysService,
                private dialog: MatDialog) {
    }

    async ngOnInit() {
        this.fieldsForSearch = [
            {name: 'Nom', tag: 'nom', type: 'contains', level: 1},
            {name: 'Date', tag: 'date', type: 'contains', level: 2},
            {name: 'Type', tag: 'type', type: 'contains', level: 3},
            {name: 'Code partenaire', tag: 'esp', type: 'contains', level: 4},
            {name: 'Statut', tag: 'status', type: 'in', level: 5},
            {name: 'Filiale', tag: 'filiale', type: 'in', level: 6},
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

    getCampagnes(page, items = this.itemsPerPage, filters = [], exporter = false) {
        this.filtres = filters;
        this.currentPage = page;
        this.entities = [];
        this.itemsPerPage = items;

        this.campagneService.findAll(this.currentPage, this.itemsPerPage, filters).toPromise()
            .then((result) => {
                if (result) {
                    this.campagnes = result.data;
                    this.totalItems = result.totalItems;
                    if (this.campagnes) {
                        for (const item of this.campagnes) {
                            console.log("******** status corresponding *****", item.status)
                            let background = '';
                            if (item.status === 'INITIE') background  = '#0facf5';
                            if (item.status === 'ENVOYE') background  = '#4680ff';
                            if (item.status === 'PARTIEL') background = '#FFB64D';
                            if (item.status === 'ATTENTE_ENVOI') background = 'gray';
                            if (item.status === 'ATTENTE_VALIDATION') background = 'gray';
                            if (item.status === 'EN ATTENTE') background = 'gray';
                            if (item.status === 'REJETE') background = 'red';
                            if (item.status === 'EXPIRE') background = '#FFB64D';
                            if (item.status === 'SOLDE') background   = '#93BE52';
                            if (item.status === 'ERROR') background   = 'red';
                            this.entities.push({
                                object: item,
                                values: [
                                    item.filiale,
                                    item.esp,
                                    item.nom,
                                    // tslint:disable-next-line:max-line-length
                                    (item.montantTotal + item.fraisTotal) !== 0 ? formatNumber(item.montantTotal + item.fraisTotal, 'fr-FR') : 'N/A',
                                    item.date,

                                    item.type,
                                    {type: 'statut', statut: item.status, background: background}
                                ]
                            });
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

        if (tag === 'details_campagne') {
            const dial = this.dialog.open(DetailsCampagneComponent, {
                width: '1200px',
                data: {
                    campagne: campagne,
                    isDialog: true
                }
            });
            dial.afterClosed().subscribe(val => {
                //
            });
        } else {
        }
    }

    exporter(filtres: any[]) {
        this.getCampagnes(null, null, filtres, true)
    }

    getPays() {
        this.paysService.getAllPays().toPromise()
            .then(
                (result: any[]) => {
                    if (result && result.length > 0) {
                        for (const e of result) {
                            this.pays.push({
                                value: e.alpha3,
                                label: e.name,
                                id: e.id
                            })
                        }
                    }
                }
            )
    }

    getLibelleById(idt, tab: any[]): any {
        console.log('Le tableau recu');
        console.log(tab);

        console.log('Id recu : ', idt);
        for (const e of tab) {
            if (e.id === idt) {
                return e;
            }
        }
        return null;
    }
}
