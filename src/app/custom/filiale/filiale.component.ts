import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import {Filiale} from '../../_model/filiale';
import {Constant} from '../../_constant/constant';
import {FilialeService} from '../../_service/autre/filiale.service';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {PaysService} from '../../_service/autre/pays.service';
import {CommunService} from '../../_service/autre/commun.service';
import {EntiteService} from '../../_service/autre/entite.service';

declare var swal;

@Component({
  selector: 'app-filiale',
  templateUrl: './filiale.component.html',
  styleUrls: ['./filiale.component.scss']
})
export class FilialeComponent implements OnInit {
    custombuttons = [
        {tag: 'active', title: 'Activ./Desactiv.', icon: 'fa fa-check'}
    ];

    headers = ['ID', 'Pays', 'Etat'];
    fieldsForSearch;

    filiales: Filiale[];
    itemsPerPage = Constant.ITEMS_PER_PAGE;
    currentPage = Constant.CURRENT_PAGE;
    totalItems: number;
    selectedFiliale: Filiale;
    entities: any[] = [];
    pays: any[] = [];
    entites: any[] = [];
    filtres: any[] = [];

    constructor(private filialeService: FilialeService,
                private paysService: PaysService,
                private entiteService: EntiteService,
                private communService: CommunService,
                private dialog: MatDialog) {
        this.getPays();
    }

    async ngOnInit() {
        this.fieldsForSearch = [
            {name: 'ID', tag: 'id', type: 'in', level: 1},
            {name: 'PaysId', tag: 'paysId', type: 'contains', level: 2},
            {name: 'Etat', tag: 'etat', type: 'contains', level: 3},
        ];
        this.getFiliales(this.currentPage);
    }

    getFiliales(page, filtres = [], exporter = false) {
        this.filtres = filtres;
        this.currentPage = page;
        this.entities = [];

        if (page == null) {
            this.itemsPerPage = null;
        }

        // Recupération de la liste des entités
        this.filialeService.findAll(this.currentPage, this.itemsPerPage, filtres).toPromise()
            .then((data) => {
                console.log('Liste des entités enregistrés : ');
                console.log(data.data);
                const tabDatas = data.data;
                if (tabDatas) {
                    let libPays = '';
                    for (const item of tabDatas) {
                        libPays = this.getLibelleById(item.paysId, this.pays).label;
                        console.log(libPays);
                        // tslint:disable-next-line:max-line-length
                        this.entities.push({object: item, values: [{type: 'id', 'id': item.id}, libPays, item.etat === true ? 'ACTIVE' : 'DESACTIVE']});
                    }
                    if (exporter) {
                        this.communService.exporter(this.entities, 'filiales');
                    }
                }
                if (exporter || page == null) {
                    this.currentPage = 1;
                    this.itemsPerPage = 10;
                }
            });
    }

    onDetails(filiale: any) {
        this.dialog.open(ShowDetailComponent, {
            width: '500px',
            data: {
                title: 'Détail filiale',
                details: [
                    {libelle: 'Id', valeur: filiale.id},
                    {libelle: 'Pays', valeur: this.getLibelleById(filiale.paysId, this.pays).label},
                    {libelle: 'Etat', valeur: filiale.etat === true ? 'ACTIVE' : 'DESACTIVE'},
                ]
            }
        });
    }

    onEdit(filiale: Filiale) {
        this.selectedFiliale = filiale;

        this.openEditDialog();
    }

    openEditDialog() {
        let tag;
        let title;

        if (this.selectedFiliale == null) {
            tag = 'add';
            title = 'Ajouter filiale';
            this.selectedFiliale = new Filiale();
        } else {
            tag = 'edit';
            title = 'Modifier filiale';
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '500px';
        dialogConfig.data = {
            title,
            entity: this.selectedFiliale,
            fields: [
                {label: 'Pays', tag: 'paysId', type: 'select', valeur: this.selectedFiliale.paysId, required: true, options: this.pays},
            ],
            validate: (entity: Filiale) => {
                this.selectedFiliale.paysId = entity.paysId;

                if (tag === 'edit') {
                    return this.filialeService.edit(this.selectedFiliale).toPromise()
                        .then(
                            (org) => {
                                return org;
                            },
                            (error) => {
                                return error;
                            }
                        );
                } else if (tag === 'add') {
                    return this.filialeService.add(this.selectedFiliale).toPromise()
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
                this.getFiliales(this.currentPage);
            }
        });
    }

    onDelete(filiale: Filiale) {
        this.dialog.open(ConfirmDeleteComponent, {
            width: '400px',
            data: {
                message: 'Vous allez supprimer ce filiale?',
                fields: [
                    {label: 'Filiale', valeur: filiale.id},
                ]
            }
        }).afterClosed().subscribe(result => {
            if (!result.canceled) {
                this.filialeService.delete(filiale)
                    .subscribe(
                        (resp) => {
                            this.getFiliales(this.currentPage);
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
        const filiale: Filiale = event.entity;

        switch (tag) {
            case 'active':
                this.activateOrDesactivateFiliale(filiale);
                break;
            case 'pays':
                break;
            default:
                break;
        }
    }

    activateOrDesactivateFiliale(filiale: any) {
        this.dialog.open(ConfirmDeleteComponent, {
            width: '400px',
            data: {
                title: filiale.etat === false ? 'Activation' : 'Désactivation',
                message: filiale.etat === false ? 'Vous allez activer cette filiale?' : 'Vous allez désactiver cette filiale',
                fields: [
                    {label: 'Filiale', valeur: filiale.id}
                ]
            }
        }).afterClosed().subscribe(result => {
            if (!result.canceled) {
                const message = filiale.etat === false ? 'Activation avec succès' : 'Désactivation avec succès';
                filiale.etat = filiale.etat === false ? true : false;
                this.filialeService.edit(filiale).toPromise()
                    .then(
                        (resp) => {
                            this.getFiliales(this.currentPage);
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
                        console.log('Liste Pays: ');
                        console.log(result);
                        for (const e of result) {
                            this.pays.push({
                                value: e.id,
                                label: e.name
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
            if (e.value === idt) {
                return e;
            }
        }
        return null;
    }

    exporter(filtres: any[]) {
        this.getFiliales(null, filtres, true);
    }
}
