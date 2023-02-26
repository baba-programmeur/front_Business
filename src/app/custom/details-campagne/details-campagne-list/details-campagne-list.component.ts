import {MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import {Component, Inject, OnInit} from '@angular/core';
import {DetailCampagneService} from '../../../_service/autre/detail-campagne.service';
import {DetailCampagne} from '../../../_model/detail-campagne';
import {Constant} from '../../../_constant/constant';
import {ShowDetailComponent} from '../../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../../global/confirm-delete/confirm-delete.component';
import {Campagne} from '../../../_model/campagne';
import {CommunService} from '../../../_service/autre/commun.service';
import {CampagneService} from '../../../_service/autre/campagne.service';
import {formatNumber} from '@angular/common';

@Component({
  selector: 'app-details-campagne-list',
  templateUrl: './details-campagne-list.component.html',
  styleUrls: ['./details-campagne-list.component.scss']
})
export class DetailsCampagneListComponent implements OnInit {
  headers = ['idclient', 'prenom', 'nom', 'montant', 'telephone', 'code', 'echeance', 'statut'];
  fieldsForSearch;
  fieldsForFilter;

  detailsCampagne: any[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedDetailCampagne: DetailCampagne;
  entities: any[];
  campagne: Campagne;
  filtres: any[] = [];
  isDialog = false;

  constructor(public dialogRef: MatDialogRef<DetailsCampagneListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private detailcampagneService: DetailCampagneService,
              private campagneService: CampagneService,
              private dialog: MatDialog,
              private communService: CommunService) {
    if (data) {
      console.log('------ data :' + JSON.stringify(data))
      this.campagne = data.campagne;
      if (data.isDialog) {
        this.isDialog = data.isDialog;
      }
    }
  }

  async ngOnInit() {
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

    this.getDetailCampagnes(this.currentPage, this.itemsPerPage, this.campagne);
  }

  getDetailCampagnes(page, size = this.itemsPerPage, campagne, filtres = null) {
    this.filtres = filtres;
    this.currentPage = page;
    this.entities = [];

    console.log('Les filtres ------------------');
    console.log(this.filtres);

    // this.detailcampagneService.findAll(this.currentPage, this.itemsPerPage, this.campagne, filtres).toPromise()
    this.campagneService.getDetails(this.campagne.typeCanal,this.campagne.id, page, size, filtres).toPromise()
        .then((result) => {
          if (result && result.data) {
            this.detailsCampagne = result.data;
            this.totalItems = +result.totalItems;

            this.detailsCampagne = this.filterDetailsCampagne(filtres, this.detailsCampagne);
            // this.totalItems = result.totalItems;
            this.detailsToEntities(this.detailsCampagne);
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
    this.entities = [];
    console.log(details);
    if (this.campagne.type === 'ENCAISSEMENT') {
      this.headers = ['idclient', 'prenom', 'nom', 'montant', 'telephone', 'code', 'echeance', 'statut', 'date'];
    } else {
      this.headers = ['idclient', 'prenom', 'nom', 'montant', 'telephone', 'statut', 'date'];
    }

    // tslint:disable-next-line:triple-equals
    if (details && details.length != 0) {
      const first: Object = details[0];

      for (const item of details) {
        const values = [];
        for (const key of this.headers) {
          if (key.toLowerCase() === 'statut') {
            let statut = '';
            let background = '';
            if (item[key] === 'initie') {
              statut = 'INITIE';
              background = '#4680ff';
            } else if (item[key] === 'envoye') {
              statut = 'ENVOYE';
              background = '#4680ff';
            } else if (item[key] === 'partiel') {
              statut = 'PARTIEL';
              background = '#FFB64D';
            }
            else if (item[key] === 'attente_validation') {
              statut = 'ATTENTE_VALIDATION';
              background = 'gray';
            }
            else if (item[key] === 'attente_envoi') {
              statut = 'ATTENTE_ENVOI';
              background = 'gray';
            }else if (item[key] === 'expire') {
              statut = 'EXPIRE';
              background = '#FFB64D';
            } else if (item[key] === 'valide') {
              statut = 'VALIDE';
              background = '#93BE52';
            } else if (item[key] === 'erreur' || item[key] === 'bloque') {
              statut = 'ECHOUE';
              background = 'red';
            } else if (item[key] === 'rejete') {
              statut = 'REJETE';
              background = 'red';
            } else if (item[key] === 'en attente' || item[key] === 'A') {
              statut = 'EN ATTENTE';
              background = 'gray';
            }
            values.push({type: 'statut', statut: statut, background: background})
          } else {
            if (key.toLowerCase() === 'idclient') {
              values.push({type: 'id', 'id': item[key]});
            } else {
              if (key.toLowerCase() === 'montant' || key.toLowerCase() === 'frais') {
                values.push(formatNumber(item[key], 'fr-FR'));
              } else {
                values.push(item[key]);
              }
            }
          }
        }
        this.entities.push({object: item, values});
      }
    }
  }

  onDetails(detailCampagne: any) {
    // console.log('_______________ DETAILS CAMPAGNE DETAILS _______________');
    console.log(detailCampagne);

    const head = Object.keys(detailCampagne);

    const details = [];
    for (const h of head) {
      // tslint:disable-next-line:triple-equals
      if (h != 'notif_sms' && h != 'notif_email') {
        if (h === 'code' && detailCampagne['statut'] !== 'rejete' && detailCampagne['statut'] !== 'en attente' && detailCampagne['statut'] !== 'initie') {
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
                  valeur: detailCampagne[h]
                }
            )
          }
        }
      }
    }

    this.dialog.open(ShowDetailComponent, {
      width: '500px',
      data: {
        title: 'Détails campagne',
        details: details
      }
    });
  }

  onEdit(detailCampagne: DetailCampagne) {
    this.selectedDetailCampagne = detailCampagne;

    this.openEditDialog();
  }

  openEditDialog() {
    let tag;
    let title;

    if (this.selectedDetailCampagne == null) {
      tag = 'add';
      title = 'Ajouter detailCampagne';
      this.selectedDetailCampagne = new DetailCampagne();
    } else {
      tag = 'edit';
      title = 'Modifier detailCampagne';
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = {
      title,
      entity: this.selectedDetailCampagne,
      fields: [
        {label: 'Id client', tag: 'idclt', type: 'text', valeur: this.selectedDetailCampagne.idclt, required: true},
        {label: 'Prénom', tag: 'prenomclt', type: 'text', valeur: this.selectedDetailCampagne.prenomclt, required: true},
        {label: 'Nom', tag: 'nomclt', type: 'text', valeur: this.selectedDetailCampagne.nomclt, required: true},
        {label: 'Téléphone', tag: 'telclt', type: 'text', valeur: this.selectedDetailCampagne.telclt, required: true},
        {label: 'Adresse mail', tag: 'mailclt', type: 'text', valeur: this.selectedDetailCampagne.mailclt, required: true},
        {label: 'Montant', tag: 'mnt', type: 'text', valeur: this.selectedDetailCampagne.mnt, required: true},
      ],
      validate: (entity: DetailCampagne) => {
        this.selectedDetailCampagne.nomclt     = entity.nomclt;

        if (tag === 'edit') {
          return this.detailcampagneService.edit(this.selectedDetailCampagne).toPromise()
              .then(
                  (org) => {
                    return org;
                  },
                  (error) => {
                    return error;
                  }
              );
        } else if (tag === 'add') {
          return this.detailcampagneService.add(this.selectedDetailCampagne).toPromise()
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
        this.getDetailCampagnes(this.currentPage, this.itemsPerPage, this.campagne);
      }
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

  onClose(val) {
    this.dialogRef.close(val);
  }
}
