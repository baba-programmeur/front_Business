import { Component, OnInit } from '@angular/core';
import {Mouvement} from '../../_model/mouvement';
import {Constant} from '../../_constant/constant';
import {MouvementService} from '../../_service/autre/mouvement.service';
import {CommunService} from '../../_service/autre/commun.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {Souscription} from '../../_model/souscription';
import {SouscriptionService} from '../../_service/autre/souscription.service';

@Component({
  selector: 'app-mouvement',
  templateUrl: './mouvement.component.html',
  styleUrls: ['./mouvement.component.scss']
})
export class MouvementComponent implements OnInit {
  headers = ['ID', 'Référence', 'Type mouvement', 'Etat mouvement', {type: 'montant', val: 'Montant'}];
  fieldsForSearch;
  fieldsForFilter;

  mouvements: Mouvement[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedMouvement: Mouvement;
  entities: any[];
  filtres: any[];

  constructor(private mouvementService: MouvementService,
              private communService: CommunService,
              private souscriptionService: SouscriptionService,
              private dialog: MatDialog) {
  }

  async ngOnInit() {
    this.fieldsForSearch = [
      {name: 'ID', tag: 'id', type: 'in', level: 1},
      {name: 'Référence', tag: 'reference', type: 'contains', level: 2},
      {name: 'Type', tag: 'type', type: 'in', level: 3},
      {name: 'Montant', tag: 'montant', type: 'in', level: 4},
    ];

    this.fieldsForFilter = [
      {
        name: 'Code partenaire',
        tag: 'souscriptionId',
        type: 'in',
        onGetFieldOptions: () => {
          return this.communService.getCodePartenairesWithIdsSouscription().toPromise().then(
              (resp: any[]) => {
                return resp;
              }
          )
        }
      },
      {
        name: 'Type mouvement',
        tag: 'type',
        type: 'in',
        onGetFieldOptions: () => {
          return new Promise(resolve => {
            resolve([
              {libelle: 'Débit', value: 'DEBIT'},
              {libelle: 'Crédit', value: 'CREDIT'},
            ])
          })
        }
      },
      {
        name: 'Etat mouvement',
        tag: 'etat',
        type: 'in',
        onGetFieldOptions: () => {
          return new Promise(resolve => {
            resolve([
              {libelle: 'Initié', value: 'INITIE'},
              {libelle: 'Valide', value: 'VALIDE'},
              {libelle: 'Suspendu', value: 'SUSPENDU'},
              {libelle: 'Annulé', value: 'ANNULE'},
            ])
          })
        }
      }
      ];

    this.getMouvements(this.currentPage);
  }

  getMouvements(page, filters = [], exporter = false) {
    this.currentPage = page;
    this.entities = [];
    this.filtres = filters;

    if (page == null) {
      this.itemsPerPage = null;
    }

    this.mouvementService.findAll(this.currentPage, this.itemsPerPage, filters).toPromise()
        .then((result) => {
          if (result) {
            this.mouvements = result.data;
            this.totalItems = result.totalItems;
            if (this.mouvements) {
              for (const item of this.mouvements) {
                let typeBackground = '';
                let etatBackground = '';
                if (item.type === 'CREDIT') { typeBackground  = '#4680ff'; }
                if (item.type === 'DEBIT') { typeBackground = '#FFB64D'; }

                if (item.etat === 'ANNULE') { etatBackground  = 'red'; }
                if (item.etat === 'VALIDE') { etatBackground  = '#93BE52'; }

                this.entities.push({
                  object: item,
                  values: [
                    {type: 'id', 'id': item.id},
                    item.reference,
                    {type: 'statut', statut: item.type.toLowerCase(), background: typeBackground},
                    {type: 'statut', statut: item.etat, background: etatBackground},
                    {type: 'montant', montant: item.montant.toLocaleString('fr-FR')},
                  ]
                });
              }
              if (exporter) {
                this.communService.exporter(this.entities, 'mouvements');
              }
            }

            if (exporter || page == null) {
              this.currentPage = 1;
              this.itemsPerPage = 10;
            }
          }
        });

  }

  onDetails(mouvement: Mouvement) {
    // find souscription
    this.souscriptionService.findById(mouvement.souscriptionId)
        .subscribe(
            (souscription: any) => {
              if (souscription) {
                let partenaire;
                if (souscription.raison_sociale && souscription.raison_sociale !== '') {
                  partenaire = souscription.raison_sociale;
                } else {
                  partenaire = souscription.prenom + ' ' + souscription.nom;
                }

                this.dialog.open(ShowDetailComponent, {
                  width: '500px',
                  data: {
                    title: 'Détail mouvement',
                    details: [
                      {libelle: 'Type compte', valeur: souscription.type},
                      {libelle: 'Code partenaire', valeur: souscription.code_partenaire},
                      {libelle: 'Partenaire', valeur: partenaire},
                      {libelle: 'Référence mouvement', valeur: mouvement.reference},
                      {libelle: 'Type mouvement', valeur: mouvement.type},
                      {libelle: 'Etat mouvement', valeur: mouvement.etat},
                      {libelle: 'Montant', valeur: mouvement.montant},
                      {libelle: 'Type compte', valeur: mouvement.typeCompte},
                      {libelle: 'Libellé compte', valeur: mouvement.libelleCompte},
                      {libelle: 'Numéro compte', valeur: mouvement.numeroCompte},
                    ]
                  }
                });
              }
            }
        );
  }

  exporter(filtres: any[]) {
    this.getMouvements(null, filtres, true);
  }
}
