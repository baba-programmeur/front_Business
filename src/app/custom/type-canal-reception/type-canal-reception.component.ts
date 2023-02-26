import { Component, OnInit } from '@angular/core';
import {Constant} from '../../_constant/constant';
import {ServerService} from '../../_service/auth/server.service';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {TypeCanal} from '../../_model/type-canal';
import {TypeCanalService} from '../../_service/autre/type-canal.service';
import {Souscription} from '../../_model/souscription';
import {ProfilFraisEditComponent} from '../profil-frais/profil-frais-edit/profil-frais-edit.component';
import {CanalReceptionComponent} from '../canal-reception/canal-reception.component';
import {Canal} from '../../_model/canal';
import {CommunService} from '../../_service/autre/commun.service';

@Component({
  selector: 'app-type-canal-reception',
  templateUrl: './type-canal-reception.component.html',
  styleUrls: ['./type-canal-reception.component.scss']
})
export class TypeCanalReceptionComponent implements OnInit {
  custombuttons = [
    {tag: 'canals', title: 'Canaux de reception', icon: 'fa fa-money'}
  ];

  headers = ['Libelle', 'Actif'];
  fieldsForSearch;
  fieldsForFiltre;
  filtres: any[] = [];

  typeCanal: TypeCanal[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedTypeCanal: TypeCanal;
  entities: any[];

  constructor(private typeCanalService: TypeCanalService,
              private dialog: MatDialog,
              private communService: CommunService,
              private serverService: ServerService) {
  }

  async ngOnInit() {
    this.fieldsForSearch = [
      {name: 'Libellé', tag: 'libelle', type: 'contains', level: 1}
    ];
    this.fieldsForFiltre = [
      {name: 'Actif', tag: 'actif', type: 'in', onGetFieldOptions: () => {
          return new Promise(resolve => {
            resolve([{libelle: 'OUI', value: 1}, {libelle: 'NON', value: 0}]);
          });
        }}
    ];

    this.getTypeCanals(this.currentPage);
  }

  getTypeCanals(page, filtres = [], exporter = false) {
    this.filtres = filtres;

    this.currentPage = page;
    this.entities = [];

    if (page == null) {
      this.itemsPerPage = null;
    }

    this.typeCanalService.findAll(this.currentPage, this.itemsPerPage, filtres).toPromise()
        .then((result) => {

          console.log('Cmpg');
          console.log(result);

          if (result) {
            this.typeCanal = result.data;
            this.totalItems = result.totalItems;
            if (this.typeCanal) {
              for (const item of this.typeCanal) {
                this.entities.push({object: item, values: [item.libelle, (item.actif == 1) ? 'OUI' : 'NON']});
              }
              if (exporter) {
                this.communService.exporter(this.entities, 'type canaux');
              }
            }
            if (exporter || page == null) {
              this.currentPage = 1;
              this.itemsPerPage = 10;
            }
          }
        });

  }

  onDetails(typeCanal: TypeCanal) {
    this.dialog.open(ShowDetailComponent, {
      data: {
        title: 'Détails type canal',
        details: [
          {libelle: 'Libellé', valeur: typeCanal.libelle},
          {libelle: 'Actif', valeur: (typeCanal.actif == 1) ? 'OUI' : 'NON'}
        ]
      }
    });
  }

  onEdit(typeCanal: TypeCanal) {
    this.selectedTypeCanal = typeCanal;

    this.openEditDialog();
  }

  openEditDialog() {
    let tag;
    let title;

    if (this.selectedTypeCanal == null) {
      tag = 'add';
      title = 'Ajouter type canal';
      this.selectedTypeCanal = new TypeCanal();
    } else {
      tag = 'edit';
      title = 'Modifier type canal';
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title,
      entity: this.selectedTypeCanal,
      fields: [
        {label: 'Libellé', tag: 'libelle', type: 'text', valeur: this.selectedTypeCanal.libelle, required: true},
        // tslint:disable-next-line:max-line-length
        {label: 'Actif', tag: 'actif', type: 'select', valeur: this.selectedTypeCanal.actif, required: true, options: [{label: 'OUI', value: 1}, {label: 'NON', value: 0}], onChange: () => {}},
      ],
      validate: (entity: TypeCanal) => {

        this.selectedTypeCanal.libelle = entity.libelle;
        this.selectedTypeCanal.actif   = entity.actif;

        if (tag === 'edit') {
          return this.typeCanalService.edit(this.selectedTypeCanal).toPromise()
              .then(
                  (org) => {
                    return org;
                  });
        } else if (tag === 'add') {
          return this.typeCanalService.add(this.selectedTypeCanal).toPromise()
              .then(
                  (org) => {
                    return org;
                  });
        }
      }
    };

    this.dialog.open(EditEntityComponent, dialogConfig)
        .afterClosed().subscribe((result) => {
      console.log('____ Edit and close dialog typeCanal ___');
      console.log(result);
      if (result && result.submit) {
        this.getTypeCanals(this.currentPage);
      }
    });
  }

  onDelete(typeCanal: TypeCanal) {
    this.dialog.open(ConfirmDeleteComponent, {
      data: {
        message: 'Vous allez supprimer ce type de canal?',
        fields: [
          {label: 'Libellé', valeur: typeCanal.libelle}
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        this.typeCanalService.delete(typeCanal)
            .subscribe(
                (resp) => {
                  this.getTypeCanals(this.currentPage, this.filtres);
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
    const typeCanal: TypeCanal = event.entity;

    switch (tag) {
      case 'canals':
        const dialog = this.dialog.open(CanalReceptionComponent, {
          data: {
            typeCanal: typeCanal,
            isDialog: true
          }
        });
        //
        // dialog.afterClosed().subscribe(val => {
        //   if (val == 'success') {
        //     this.getSouscriptions(this.currentPage, this.filtres);
        //   }
        // });
        break;
      default:
        break;
    }
  }

  exporter(filtres: any[]) {
    this.getTypeCanals(null, filtres, true);
  }
}
