import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {Canal} from '../../_model/canal';
import {Constant} from '../../_constant/constant';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {CanalService} from '../../_service/autre/canal.service';
import {TypeCanal} from '../../_model/type-canal';
import {CanalEndpointComponent} from './canal-endpoint/canal-endpoint.component';
import {Pays} from '../../_model/pays';
import {PaysService} from '../../_service/autre/pays.service';
import {EntiteService} from '../../_service/autre/entite.service';
import {CommunService} from '../../_service/autre/commun.service';

@Component({
  selector: 'app-canal-reception',
  templateUrl: './canal-reception.component.html',
  styleUrls: ['./canal-reception.component.scss']
})
export class CanalReceptionComponent implements OnInit {
  custombuttons = [
    {tag: 'endpoints', title: 'Endpoints', icon: 'fa fa-money'}
  ];
  headers = ['Libelle', 'Pays', 'Actif', 'Montant Min', 'Montant Max'];
  fieldsForSearch;
  fieldsForFilter;

  canals: Canal[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedCanal: Canal;
  typeCanal: TypeCanal;
  pays: any[] = [];
  entites: any[] = [];
  entities: any[];
  filtres: any;
  isDialog = false;


  constructor(public dialogRef: MatDialogRef<CanalReceptionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog,
              private paysService: PaysService,
              private entiteService: EntiteService,
              private communService: CommunService,
              private canalService: CanalService) {
    if (data) {
      this.typeCanal = data.typeCanal;
      if (data.isDialog) {
        this.isDialog = data.isDialog;
      }
      if (this.typeCanal.libelle === 'cash') {
        this.custombuttons = [];
      }
    }
  }

  async ngOnInit() {
    this.fieldsForSearch  = [
      {name: 'Libelle', tag: 'libelle', type: 'contains'},
      {name: 'Pays', tag: 'pays', type: 'in'}
    ];

    this.fieldsForFilter = [
      {name: 'Actif', tag: 'actif', type: 'in', onGetFieldOptions: () => {
          return new Promise(resolve => {
            resolve([{libelle: 'OUI', value: 1}, {libelle: 'NON', value: 0}]);
          })
        }}
    ];

    this.getPays();
    this.getEntites();
    this.getCanals(this.currentPage);
  }

  getCanals(page, filtres = null, exporter = false) {
    if (filtres) {
      this.filtres = filtres;
    }

    console.log(this.filtres);
    this.currentPage = page;
    this.entities = [];

    if (page == null) {
      this.itemsPerPage = null;
    }

    this.canalService.findAll(this.currentPage, this.itemsPerPage, this.typeCanal.id, filtres).toPromise()
        .then((result) => {
          if (result) {
            this.canals = result.data;
            this.totalItems = result.totalItems;
            if (this.canals) {
              for (const item of this.canals) {
                // tslint:disable-next-line:max-line-length
                this.entities.push({object: item, values: [item.libelle, item.pays, item.actif == 1 ? 'OUI' : 'NON', item.montantMin, item.montantMax]});
              }
              if (exporter) {
                this.communService.exporter(this.entities, 'canaux de reception');
              }
              if (exporter || page == null) {
                this.currentPage = 1;
                this.itemsPerPage = 10;
              }
            }
          }
        });
  }

  onDetails(canal: Canal) {
    this.dialog.open(ShowDetailComponent, {
      data: {
        title: 'Détail canal',
        details: [
          {libelle: 'Libelle', valeur: canal.libelle},
          {libelle: 'Pays', valeur: canal.pays},
          {libelle: 'Actif', valeur: (canal.actif == 1) ? 'OUI' : 'NON' },
          {libelle: 'Montant Min', valeur: canal.montantMin },
          {libelle: 'Montant Max', valeur: canal.montantMax },
          {libelle: 'Entite', valeur: this.getLibelleEntiteById(canal.entiteId) },
        ]
      }
    });
  }

  onEdit(canal: Canal) {
    this.selectedCanal = canal;
    this.openEditDialog();
  }

  openEditDialog() {
    let tag;
    let title;

    if (this.selectedCanal == null) {
      tag = 'add';
      title = 'Ajouter canal';
      this.selectedCanal = new Canal();
      this.selectedCanal.typeCanalIdId = this.typeCanal.id;
    } else {
      tag = 'edit';
      title = 'Modifier canal';
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = {
      title,
      entity: this.selectedCanal,
      fields: [
        {label: 'Libelle', tag: 'libelle', type: 'text', valeur: this.selectedCanal.libelle, required: true},
        {label: 'Pays', tag: 'pays', type: 'select', valeur: this.selectedCanal.pays, required: true,
          options: this.pays,
          onChange : ()  => {},
        },
        {label: 'Actif', tag: 'actif', type: 'select', valeur: this.selectedCanal.actif, required: true,
          options: [
            {label: 'OUI', value: 1},
            {label: 'NON', value: 0}
          ],
          onChange : ()  => {},
        },
        {label: 'Montant Min', tag: 'montantMin', type: 'number', valeur: this.selectedCanal.montantMin, required: false},
        {label: 'Montant Max', tag: 'montantMax', type: 'number', valeur: this.selectedCanal.montantMax, required: false},
        {label: 'Entite', tag: 'entiteId', type: 'select', valeur: this.selectedCanal.entiteId, required: false, options: this.entites},
      ],
      validate: (entity: Canal) => {
        this.selectedCanal.libelle      = entity.libelle;
        this.selectedCanal.pays         = entity.pays.toUpperCase();
        this.selectedCanal.actif        = entity.actif;
        this.selectedCanal.montantMin   = entity.montantMin;
        this.selectedCanal.montantMax   = entity.montantMax;
        this.selectedCanal.entiteId     = entity.entiteId;

        if (tag === 'edit') {
          return this.canalService.edit(this.selectedCanal).toPromise()
              .then(
                  (org) => {
                    return org;
                  });
        } else if (tag === 'add') {
          return this.canalService.add(this.selectedCanal).toPromise()
              .then(
                  (org) => {
                    return org;
                  });
        }
      }
    };

    this.dialog.open(EditEntityComponent, dialogConfig)
        .afterClosed().subscribe((result) => {
      if (result && result.submit) {
        this.getCanals(this.currentPage);
      }
    });
  }

  onDelete(canal: Canal) {
    this.dialog.open(ConfirmDeleteComponent, {
      data: {
        message: 'Vous allez supprimer ce canal?',
        fields: [
          {label: 'Canal', valeur: canal.libelle}
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        this.canalService.delete(canal)
            .subscribe(
                (resp) => {
                  this.getCanals(this.currentPage, this.filtres);
                }
            );
      }
    });
  }

  onClose(val) {
    this.dialogRef.close(val);
  }

  /**
   * Gestion boutons supplément dans la liste
   *
   * @param event
   */
  onCustomButton(event) {
    const tag          = event.tag;
    const canal: Canal = event.entity;

    console.log('__ Canal');
    console.log(canal);

    switch (tag) {
      case 'endpoints':
        const dialog = this.dialog.open(CanalEndpointComponent, {
          data: {
            canal: canal
          }
        });
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

  getPays() {
    this.paysService.getAllPays().toPromise()
        .then(
            (result: any[]) => {
              if (result && result.length > 0) {
                for (const e of result) {
                  this.pays.push({
                    value: e.alpha3,
                    label: e.name
                  })
                }
              }
            }
        )
  }

  getEntites() {
    this.entiteService.getEntites().toPromise()
        .then(
            (result: any[]) => {
              if (result && result.length > 0) {
                for (const e of result) {
                  this.entites.push({
                    value: e.id,
                    label: e.nom
                  })
                }
              }
            }
        )
  }

  getLibelleEntiteById(id) {
    const result = this.entites.filter(x => x.value === id);
    if (result) {
      return result[0].label;
    } else {
      return id;
    }
  }

  exporter(filtres: any) {
    this.getCanals(null, filtres, true);
  }
}
