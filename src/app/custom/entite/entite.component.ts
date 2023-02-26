import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import {Entite} from '../../_model/entite';
import {Constant} from '../../_constant/constant';
import {EntiteService} from '../../_service/autre/entite.service';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {PaysService} from '../../_service/autre/pays.service';
import {UsersListComponent} from '../../user/profil/users/users-list/users-list.component';
import {EntitePaysComponent} from './entite-pays/entite-pays.component';
import {CommunService} from '../../_service/autre/commun.service';

declare var swal;

@Component({
  selector: 'app-entite',
  templateUrl: './entite.component.html',
  styleUrls: ['./entite.component.scss']
})
export class EntiteComponent implements OnInit {
    custombuttons = [
        {tag: 'active', title: 'Activ./Desactiv.', icon: 'fa fa-check'},
        {tag: 'pays', title: 'Filiales', icon: 'fa fa-flag'}
    ];

    headers = ['Nom', 'RCC', 'Ninea', 'Adresse', 'Telephone', 'Email', 'Domaine', 'Pays', 'Statut'];
    fieldsForSearch;

    entites: Entite[];
    itemsPerPage = Constant.ITEMS_PER_PAGE;
    currentPage = Constant.CURRENT_PAGE;
    totalItems: number;
    selectedEntite: Entite;
    entities: any[] = [];
    pays: any[] = [];
    filtres: any[] = [];

    constructor(private entiteService: EntiteService,
                private paysService: PaysService,
                private communService: CommunService,
                private dialog: MatDialog) {
    }

    async ngOnInit() {
        this.fieldsForSearch = [
            {name: 'Nom', tag: 'nom', type: 'contains', level: 1},
            {name: 'Ninea', tag: 'ninea', type: 'contains', level: 2},
            {name: 'Rcc', tag: 'rcc', type: 'contains', level: 3},
            {name: 'Pays', tag: 'pays', type: 'contains', level: 4},
            {name: 'Adresse', tag: 'adresse', type: 'contains', level: 5},
            {name: 'Statut', tag: 'statut', type: 'contains', level: 6},
        ];

        this.getEntites(this.currentPage);
        this.getPays();
    }

    getEntites(page, filtres = [], exporter = false) {
        console.log('Les filtres : ', filtres);
        this.filtres = filtres;
        this.currentPage = page;
        this.entities = [];

        if (page == null) {
            this.itemsPerPage = null;
        }

        // Recupération de la liste des entités
        this.entiteService.findAll(this.currentPage, this.itemsPerPage, filtres).toPromise()
            .then((data) => {
                console.log('Liste des entités enregistrés : ');
                console.log(data.data);
                const tabDatas = data.data;
                if (tabDatas) {
                    for (const item of tabDatas) {
                        const values = [];
                        for (const key of this.headers) {
                            if (key.toLowerCase() === 'statut') {
                                values.push(item[key.toLowerCase()] === 'VALIDE' ? 'ACTIVE' : 'DESACTIVE');
                            } else {
                                values.push(item[key.toLowerCase()]);
                            }
                        }
                        this.entities.push({object: item, values});
                    }
                    if (exporter) {
                        this.communService.exporter(this.entities, 'entites');
                    }
                }
                if (exporter || page == null) {
                    this.currentPage = 1;
                    this.itemsPerPage = 10;
                }
            });
    }

    onDetails(entite: any) {
        console.log('_______________ ENTITE DETAILS ________' +
            '_______');
        console.log(entite);
        const head = Object.keys(entite);

        const details = [];
        for (const h of head) {
            if (h.toLowerCase() === 'statut') {
                details.push(
                    {
                        libelle: h.toUpperCase(),
                        valeur: entite[h] === 'VALIDE' ? 'ACTIVE' : 'DESACTIVE'
                    }
                );
            } else {
                details.push(
                    {
                        libelle: h.toUpperCase(),
                        valeur: entite[h]
                    }
                );
            }
        }

        this.dialog.open(ShowDetailComponent, {
            width: '500px',
            data: {
                title: 'Détails entité',
                details: details
            }
        });
    }

    onEdit(entite: Entite) {
        this.selectedEntite = entite;

        this.openEditDialog();
    }

    openEditDialog() {
        let tag;
        let title;
        let id;
        let statut;

        if (this.selectedEntite == null) {
            tag = 'add';
            title = 'Ajouter entité';
            this.selectedEntite = new Entite();
        } else {
            tag = 'edit';
            title = 'Modifier entité';
            id = this.selectedEntite.id;
            statut = this.selectedEntite.statut;
        }

        const tabFields = [];

        for (const he of this.headers) {
            if (he.toLowerCase() !== 'statut' && he.toLowerCase() !== 'id') {
                if (he.toLowerCase() === 'pays') {
                    tabFields.push({
                        label: he.toUpperCase(),
                        tag: he.toLowerCase(),
                        type: 'select',
                        valeur: this.selectedEntite[he.toLowerCase()],
                        required: true,
                        options: this.pays,
                        onChange : ()  => {},
                    })
                } else {
                    tabFields.push({
                        label: he.toUpperCase(),
                        tag: he.toLowerCase(),
                        type: 'text',
                        valeur: this.selectedEntite[he.toLowerCase()],
                        required: true
                    })
                }
            }
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '500px';
        dialogConfig.data = {
            title,
            entity: this.selectedEntite,
            fields: tabFields,
            validate: (entity: Entite) => {
                for (const h of this.headers) {
                    this.selectedEntite[h.toLowerCase()] = entity[h.toLowerCase()];
                }

                if (tag === 'edit') {
                    this.selectedEntite.id = id;
                    this.selectedEntite.statut = statut;
                    console.log(this.selectedEntite);
                    return this.entiteService.edit(this.selectedEntite).toPromise()
                        .then(
                            (org) => {
                                return org;
                            },
                            (error) => {
                                return error;
                            }
                        );
                } else if (tag === 'add') {
                    return this.entiteService.add(this.selectedEntite).toPromise()
                        .then(
                            (org) => {
                                return org;
                            },
                            (error) => {
                                return error;
                            }
                        );
                }
            }
        };

        this.dialog.open(EditEntityComponent, dialogConfig)
            .afterClosed().subscribe((result) => {
            if (result && result.submit) {
                this.getEntites(this.currentPage);
            }
        });
    }

    onDelete(entite: Entite) {
        this.dialog.open(ConfirmDeleteComponent, {
            width: '400px',
            data: {
                message: 'Vous allez supprimer ce entité?',
                fields: [
                    {label: 'Entite', valeur: entite.nom}
                ]
            }
        }).afterClosed().subscribe(result => {
            if (!result.canceled) {
                this.entiteService.delete(entite)
                    .subscribe(
                        (resp) => {
                            this.getEntites(this.currentPage);
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
        const tag        = event.tag;
        const entite: Entite = event.entity;

        switch (tag) {
            case 'active':
                this.activateOrDesactivateEntite(entite);
                break;
            case 'pays':
                this.dialog.open(EntitePaysComponent, {
                    data: {
                        entite: entite.id,
                        pays: this.pays,
                        isDialog: true
                    }
                }).afterClosed().subscribe(result => {
                });
                break;
            default:
                break;
        }
    }

    activateOrDesactivateEntite(entite: any) {
        this.dialog.open(ConfirmDeleteComponent, {
            width: '400px',
            data: {
                title: entite.statut === 'NON_VALIDE' ? 'Activation' : 'Désactivation',
                message: entite.statut === 'NON_VALIDE' ? 'Vous allez activer cette entité?' : 'Vous allez désactiver cette entité',
                fields: [
                    {label: 'Entite', valeur: entite.id}
                ]
            }
        }).afterClosed().subscribe(result => {
            if (!result.canceled) {
                const message = entite.statut === 'NON_VALIDE' ? 'Activation avec succès' : 'Désactivation avec succès';
                entite.statut = entite.statut === 'NON_VALIDE' ? 'VALIDE' : 'NON_VALIDE';
                this.entiteService.active(entite).toPromise()
                    .then(
                        (resp) => {
                            this.getEntites(this.currentPage);
                            swal({
                                'icon': 'success',
                                'text': message
                            })
                        }
                    );
            }
        });
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

    exporter(filtres: any[]) {
        this.getEntites(null, filtres, true);
    }
}
