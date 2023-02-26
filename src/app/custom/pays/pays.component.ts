import { Component, OnInit } from '@angular/core';
import {Constant} from '../../_constant/constant';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ServerService} from '../../_service/auth/server.service';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {Pays} from '../../_model/pays';
import {PaysService} from '../../_service/autre/pays.service';
import {ImageUploaderComponent} from '../image-uploader/image-uploader.component';
import {CommunService} from '../../_service/autre/commun.service';

declare var swal;

@Component({
  selector: 'app-pays',
  templateUrl: './pays.component.html',
  styleUrls: ['./pays.component.scss']
})
export class PaysComponent implements OnInit {
  headers = ['Drapeau', 'Nom', 'Code iso2', 'Code iso3', 'Indicatif'];
  custombuttons = [
    // {tag: 'edit_flag', title: 'Changer le drapeau', icon: 'fa fa-flag'}
  ];
  fieldsForSearch;
  pays: Pays[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedPays: Pays;
  entities: any[];
  filtres: any[] = [];

  constructor(private paysService: PaysService,
              private dialog: MatDialog,
              private communService: CommunService,
              private serverService: ServerService) {
  }

  async ngOnInit() {
    this.fieldsForSearch = [
      {name: 'Nom', tag: 'name', type: 'contains', level: 1},
      {name: 'Code iso2', tag: 'alpha2', type: 'in', level: 2},
      {name: 'Code iso3', tag: 'alpha3', type: 'in', level: 3},
      {name: 'Indicatif', tag: 'indicatif', type: 'in', level: 4}
    ];

    this.getAllPays(this.currentPage);
  }

  getAllPays(page, filtres = [], exporter = false) {
    this.currentPage = page;
    this.entities = [];
    this.filtres = filtres;

    if (page == null) {
      this.itemsPerPage = null;
    }

    this.paysService.findAll(this.currentPage, this.itemsPerPage, filtres).toPromise()
        .then((result) => {
          if (result) {
            this.pays = result.data;
            this.totalItems = result.totalItems;
            if (this.pays) {
              for (const item of this.pays) {
                this.entities.push({object: item, values: [
                    // tslint:disable-next-line:max-line-length
                    {type: 'img', src: 'https://lipis.github.io/flag-icon-css/flags/4x3/' + item.alpha2.toLowerCase() + '.svg', width: '25', default: 'flag.PNG', rounded: false},
                    item.name,
                    item.alpha2,
                    item.alpha3,
                    item.indicatif
                  ]
                });
              }
              if (exporter) {
                this.communService.exporter(this.entities, 'pays');
              }
            }
            if (exporter || page == null) {
              this.currentPage = 1;
              this.itemsPerPage = 10;
            }
          }
        });
  }

  onDetails(pays: Pays) {
    this.dialog.open(ShowDetailComponent, {
      data: {
        title: 'Détails pays',
        details: [
          {libelle: 'Nom', valeur: pays.name},
          {libelle: 'Code iso2', valeur: pays.alpha2},
          {libelle: 'Code iso3', valeur: pays.alpha3},
          {libelle: 'Indicatif', valeur: pays.indicatif},
        ]
      }
    });
  }

  onEdit(pays: Pays) {
    this.selectedPays = pays;

    this.openEditDialog();
  }

  openEditDialog() {
    let tag;
    let title;

    if (this.selectedPays == null) {
      tag = 'add';
      title = 'Ajouter pays';
      this.selectedPays = new Pays();
    } else {
      tag = 'edit';
      title = 'Modifier pays';
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = {
      title,
      entity: this.selectedPays,
      fields: [
        {label: 'Nom', tag: 'name', type: 'text', valeur: this.selectedPays.name, required: true},
        {label: 'Code iso2', tag: 'alpha2', type: 'text', valeur: this.selectedPays.alpha2, required: true},
        {label: 'Code iso3', tag: 'alpha3', type: 'text', valeur: this.selectedPays.alpha3, required: true},
        {label: 'Indicatif', tag: 'indicatif', type: 'number', valeur: this.selectedPays.indicatif, required: true},
      ],
      validate: (entity: Pays) => {
        this.selectedPays.name       = entity.name;
        this.selectedPays.alpha2     = entity.alpha2;
        this.selectedPays.alpha3     = entity.alpha3;
        this.selectedPays.atpsWs     = entity.atpsWs;
        this.selectedPays.indicatif  = entity.indicatif;

        if (tag === 'edit') {
          return this.paysService.edit(this.selectedPays).toPromise()
              .then(
                  (org) => {
                    return org;
                  },
                  (error) => {
                    return error;
                  }
              );
        } else if (tag === 'add') {
          return this.paysService.add(this.selectedPays, true).toPromise()
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
        this.getAllPays(this.currentPage);
      }
    });
  }

  onDelete(pays: Pays) {
    this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        message: 'Vous allez supprimer ce pays?',
        fields: [
          {label: 'Pays', valeur: pays.name}
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        this.paysService.delete(pays)
            .subscribe(
                (resp) => {
                  this.getAllPays(this.currentPage);
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
    const tag        = event.tag;
    const pays: Pays = event.entity;

    switch (tag) {
      case 'edit_flag':
        const dialogRef = this.dialog.open(ImageUploaderComponent, {
          width: '900px'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (!result.canceled) {
            swal(
                {
                  title: 'Confirmation',
                  text: 'Vous allez modifier l\'image de profil ?',
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
                    console.log(result);

                    this.serverService.uploadPaysImage(result.file, pays.id)
                        .subscribe(
                            (response: any) => {
                              console.log('___ file saved : ');
                              console.log(response);
                              if (response) {
                                pays.drapeau = response.imageUrl;
                                this.getAllPays(this.currentPage);
                              }
                            });
                  }
                }
            );

          }
        });
        break;
      default:
        break;
    }
  }

  exporter(filtres: any[]) {
    this.getAllPays(null, filtres, true);
  }
}
