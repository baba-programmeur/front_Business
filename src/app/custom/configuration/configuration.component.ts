import { Component, OnInit } from '@angular/core';
import {Constant} from '../../_constant/constant';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ServerService} from '../../_service/auth/server.service';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {Configuration} from '../../_model/configuration';
import {ConfigurationService} from '../../_service/autre/configuration.service';
import {ConfigurationEndpointComponent} from './configuration-endpoint/configuration-endpoint.component';
import {EntiteService} from '../../_service/autre/entite.service';
import {UserService} from '../../_service/auth/user.service';
import {CommunService} from '../../_service/autre/commun.service';

declare var swal;

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  custombuttons = [
    {tag: 'endpoints', title: 'Endpoints', icon: 'fa fa-link'}
  ];
  // tslint:disable-next-line:max-line-length
  headers = ['ID', 'Prefixe identifiant partenaire', 'Prefixe code decaissement', 'Prefixe code encaissement', 'Taille Code Campagne', 'Entité', 'Gestion Plafond'];
  fieldsForSearch;
  configuration: Configuration[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedConfiguration: Configuration;
  entities: any[];
  entites = [];
  filtres: any[] = [];

  constructor(private configurationService: ConfigurationService,
              private dialog: MatDialog,
              private entiteService: EntiteService,
              private userService: UserService,
              private communService: CommunService,
              private serverService: ServerService) {
  }

  async ngOnInit() {
    this.fieldsForSearch = [
      {name: 'ID', tag: 'id', type: 'in', level: 1},
      {name: 'Prefixe identifiant partenaire', tag: 'enteteSouscription', type: 'contains', level: 2},
      {name: 'Prefixe code decaissement', tag: 'enteteDecaissement', type: 'in', level: 3},
      {name: 'Prefixe code encaissement', tag: 'enteteEncaissement', type: 'in', level: 4},
      {name: 'Taille Code Campagne', tag: 'tailleCode', type: 'in', level: 5},
      {name: 'Gestion plafond', tag: 'plafond', type: 'in', level: 6},
      {name: 'Entite', tag: 'entity', type: 'in', level: 6}
    ];

    this.getEntites();
    this.getAllConfiguration(this.currentPage);
  }

  getAllConfiguration(page, filtres = [], exporter = false) {
    this.currentPage = page;
    this.entities = [];
    this.filtres = filtres;

    if (page == null) {
      this.itemsPerPage = null;
    }

    this.configurationService.findAll(this.currentPage, this.itemsPerPage, filtres).toPromise()
        .then((result) => {

          if (result) {
            console.log(result);
            this.configuration = result.data;
            this.totalItems = result.totalItems;
            if (this.configuration) {
              for (const item of this.configuration) {
                // tslint:disable-next-line:max-line-length
                this.entities.push({object: item, values: [{type: 'id', 'id': item.id}, item.enteteSouscription, item.enteteDecaissement, item.enteteEncaissement, item.tailleCode, this.getLibelleById(item.entity, this.entites) === null ? item.entity : this.getLibelleById(item.entity, this.entites).label, item.plafond]});
              }
              if (exporter) {
                this.communService.exporter(this.entities, 'configurations');
              }
            }
            if (exporter || page == null) {
              this.currentPage = 1;
              this.itemsPerPage = 10;
            }
          }
        });
  }

  onDetails(configuration: Configuration) {
    this.dialog.open(ShowDetailComponent, {
      width: '500px',
      data: {
        title: 'Détail configuration ',
        details: [
          {libelle: 'Prefixe identifiant partenaire', valeur: configuration.enteteSouscription},
          {libelle: 'Prefixe code decaissement', valeur: configuration.enteteDecaissement},
          {libelle: 'Prefixe code encaissement', valeur: configuration.enteteEncaissement},
          {libelle: 'Taille Code Campagne', valeur: configuration.tailleCode},
          {libelle: 'Gestion plafond', valeur: configuration.plafond},
          {libelle: 'Entité', valeur: configuration.entity},
        ]
      }
    });
  }

  onEdit(configuration: Configuration) {
    this.selectedConfiguration = configuration;
    this.openEditDialog();
  }

  openEditDialog() {
    let tag;
    let title;

    if (this.selectedConfiguration == null) {
      tag = 'add';
      title = 'Ajouter configuration';
      this.selectedConfiguration = new Configuration();
    } else {
      tag = 'edit';
      title = 'Modifier configuration';
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = {
      title,
      entity: this.selectedConfiguration,
      fields: [
        // tslint:disable-next-line:max-line-length
        {label: 'Prefixe identifiant partenaire', tag: 'enteteSouscription', type: 'text', valeur: this.selectedConfiguration.enteteSouscription, required: true},
        // tslint:disable-next-line:max-line-length
        {label: 'Prefixe code decaissement', tag: 'enteteDecaissement', type: 'text', valeur: this.selectedConfiguration.enteteDecaissement, required: true},
        // tslint:disable-next-line:max-line-length
        {label: 'Prefixe code encaissement', tag: 'enteteEncaissement', type: 'text', valeur: this.selectedConfiguration.enteteEncaissement, required: false},
        {label: 'Taille Code Campagne', tag: 'tailleCode', type: 'number', valeur: this.selectedConfiguration.tailleCode, required: false},
        // tslint:disable-next-line:max-line-length
        {label: 'Gestion plafond', tag: 'plafond', type: 'select', valeur: this.selectedConfiguration.plafond, required: false, options: [{label: 'interne', value: 'interne'}, {label: 'externe', value: 'externe'}]},
      ],
      validate: (entity: Configuration) => {
        this.selectedConfiguration.enteteSouscription       = entity.enteteSouscription;
        this.selectedConfiguration.enteteDecaissement    = entity.enteteDecaissement;
        this.selectedConfiguration.enteteEncaissement   = entity.enteteEncaissement;
        this.selectedConfiguration.tailleCode     = entity.tailleCode;
        this.selectedConfiguration.plafond     = entity.plafond;

        if (tag === 'edit') {
          return this.configurationService.edit(this.selectedConfiguration).toPromise()
              .then(
                  (org) => {
                    return org;
                  },
                  (error) => {
                    return error;
                  }
              );
        } else if (tag === 'add') {
          return this.configurationService.add(this.selectedConfiguration).toPromise()
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
        this.getAllConfiguration(this.currentPage);
      }
    });
  }

  onDelete(configuration: Configuration) {
    this.dialog.open(ConfirmDeleteComponent, {
      data: {
        message: 'Vous allez supprimer ce configuration?',
        fields: [
          {label: 'Configuration', valeur: configuration.id}
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        this.configurationService.delete(configuration)
            .subscribe(
                (resp) => {
                  this.getAllConfiguration(this.currentPage);
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
    const tag          = event.tag;
    const configuration: Configuration = event.entity;

    console.log('__ Configuration');
    console.log(configuration);

    switch (tag) {
      case 'endpoints':
        if (configuration.plafond.toLowerCase() === 'interne') {
          swal({
            icon: 'warning',
            text: 'Impossible de configurer les endpoints pour le plafond interne'
          });
        } else {
          const dialog = this.dialog.open(ConfigurationEndpointComponent, {
            data: {
              configuration: configuration
            }
          });
        }
        break;
      default:
        break;
    }
  }

  getEntites() {
    if (this.userService.isSuperAdmin()) {
      this.entiteService.findAll(this.currentPage, this.itemsPerPage, null).toPromise()
          .then((data) => {
            console.log('Liste des entités enregistrés : ');
            console.log(data.data);
            const tabDatas = data.data;
            if (tabDatas) {
              for (const el of tabDatas) {
                if (el.statut.toUpperCase() === 'VALIDE') {
                  this.entites.push({
                    label: el.nom,
                    value: el.id
                  })
                }
              }
            }
          });
    }
  }

  getLibelleById(idt, tab: any[]): any {
    console.log('Le tableau recu');
    console.log(tab);

    console.log('Id recu : ', idt);
    for (const e of tab) {
      if (e.value == idt) {
        return e;
      }
    }
    return null;
  }

  exporter(filtres: any[]) {
    this.getAllConfiguration(null, filtres, true);
  }
}
