import {Component, Inject, OnInit} from '@angular/core';
import {Filiale} from '../../../_model/filiale';
import {Constant} from '../../../_constant/constant';
import {FilialeService} from '../../../_service/autre/filiale.service';
import {PaysService} from '../../../_service/autre/pays.service';
import {EntiteService} from '../../../_service/autre/entite.service';
import {ShowDetailComponent} from '../../global/show-detail/show-detail.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {EditEntityComponent} from '../../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../../global/confirm-delete/confirm-delete.component';
import {CommunService} from '../../../_service/autre/commun.service';

declare var swal;

@Component({
  selector: 'app-entite-pays',
  templateUrl: './entite-pays.component.html',
  styleUrls: ['./entite-pays.component.scss']
})
export class EntitePaysComponent implements OnInit {

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
  filtres: any[] = [];
  entiteId = null;
  custom = true;

  constructor(private filialeService: FilialeService,
              private dialog: MatDialog,
              private paysService: PaysService,
              private communService: CommunService,
              public dialogRef: MatDialogRef<EditEntityComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    // this.getPays();
    if (data) {
      console.log('Identifiant de l\'entite : ', data.entite);
      this.entiteId = data.entite;
      this.custom = false;
    }
  }

  async ngOnInit() {
    this.fieldsForSearch = [
      {name: 'ID', tag: 'id', type: 'in', level: 1},
      {name: 'PaysId', tag: 'paysId', type: 'contains', level: 2},
      {name: 'Etat', tag: 'etat', type: 'contains', level: 3},
    ];
    this.getPays();
    this.getFiliales(this.currentPage);
  }

  getFiliales(page, filtres = [], exporter = false) {
    filtres.push({
      libelle: 'EntiteId',
      tag: 'entiteId',
      type: 'in',
      value: this.entiteId + '',
      valueLabel: this.entiteId
    });
    this.filtres = filtres;
    this.currentPage = page;
    this.entities = [];

    if (page == null) {
      this.itemsPerPage = null;
    }

    // Recupération
    this.filialeService.findAll(this.currentPage, this.itemsPerPage, filtres).toPromise()
        .then((data) => {
          console.log('Liste des entités enregistrés : ');
          console.log(data.data);
          const tabDatas = data.data;
          if (tabDatas) {
            let libPays: any;
            for (const item of tabDatas) {
              libPays = this.getLibelleById(item.paysId, this.pays);
              console.log('------------------ Libelle pays : ', libPays);
              // tslint:disable-next-line:max-line-length
              this.entities.push({object: item, values: [{type: 'id', 'id': item.id}, libPays != null ? libPays.label : item.paysId, item.etat ? 'active' : 'desactive']});
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
          {libelle: 'Etat', valeur: filiale.etat ? 'active' : 'desactive'},
        ]
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

  exporter(filtres: any[]) {
      this.getFiliales(null, filtres, true);
  }
}
