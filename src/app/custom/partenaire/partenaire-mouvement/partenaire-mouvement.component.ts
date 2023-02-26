import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Mouvement} from '../../../_model/mouvement';
import {Constant} from '../../../_constant/constant';
import {MouvementService} from '../../../_service/autre/mouvement.service';
import {CommunService} from '../../../_service/autre/commun.service';
import {SouscriptionService} from '../../../_service/autre/souscription.service';
import {Souscription} from '../../../_model/souscription';
import {ShowDetailComponent} from '../../global/show-detail/show-detail.component';

@Component({
  selector: 'app-partenaire-mouvement',
  templateUrl: './partenaire-mouvement.component.html',
  styleUrls: ['./partenaire-mouvement.component.scss']
})
export class PartenaireMouvementComponent implements OnInit {
  headers = ['Référence', 'Type mouvement', 'Etat mouvement', {type: 'montant', val: 'Montant'}];
  fieldsForSearch;
  fieldsForFilter;

  isDialog = false;

  mouvements: Mouvement[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  entities: any[];
  filtres: any[] = [];

  constructor(public dialogRef: MatDialogRef<ShowDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mouvementService: MouvementService,
              private communService: CommunService,
              private souscriptionService: SouscriptionService,
              private dialog: MatDialog) {
    if (data && data.isDialog) {
      this.isDialog = true;
    }
  }

  async ngOnInit() {
    this.fieldsForSearch = [
      {name: 'ID', tag: 'id', type: 'in', level: 1},
      {name: 'Référence', tag: 'reference', type: 'contains', level: 2},
      {name: 'Montant', tag: 'montant', type: 'in', level: 3},
    ];

    this.fieldsForFilter = [
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

    this.getPartenaireMouvements(this.currentPage);
  }

  getPartenaireMouvements(page, filters = []) {
    console.log('___ GET ALL MOUVEMENTS');

    this.filtres = filters;
    this.currentPage = page;
    this.entities = [];

    this.mouvementService.findAllForPartenaire(this.currentPage, this.itemsPerPage, filters).toPromise()
        .then((result) => {
          if (result) {
            this.mouvements = result.data;
            this.totalItems = result.totalItems;
            if (this.mouvements) {
              for (const item of this.mouvements) {
                let typeBackground = '';
                let etatBackground = '';
                if (item.type === 'CREDIT') typeBackground  = '#4680ff';
                if (item.type === 'DEBIT') typeBackground = '#FFB64D';

                if (item.etat === 'ANNULE') etatBackground  = 'red';
                if (item.etat === 'VALIDE') etatBackground  = '#93BE52';

                this.entities.push({
                  object: item,
                  values: [
                    item.reference,
                    {type: 'statut', statut: item.type.toLowerCase(), background: typeBackground},
                    {type: 'statut', statut: item.etat, background: etatBackground},
                    {type: 'montant', montant: item.montant.toLocaleString('fr-FR')},
                  ]
                });
              }
            }
          }
        });

  }

  onDetails(mouvement: Mouvement) {
    // find souscription
    this.souscriptionService.findById(mouvement.souscriptionId)
        .subscribe(
            (souscription: any) => {
              console.log(souscription);
              if (souscription) {
                let partenaire;
                if (souscription.raison_sociale && souscription.raison_sociale !== '') {
                  partenaire = souscription.raison_sociale;
                } else {
                  partenaire = souscription.prenom + ' ' + souscription.nom;
                }

                const tab = [
                  {libelle: 'Code partenaire', valeur: souscription.code_partenaire},
                  {libelle: 'Partenaire', valeur: partenaire},
                  {libelle: 'Référence mouvement', valeur: mouvement.reference},
                  {libelle: 'Type mouvement', valeur: mouvement.type},
                  {libelle: 'Etat mouvement', valeur: mouvement.etat},
                  {libelle: 'Montant', valeur: mouvement.montant},
                ];

                if (mouvement.typeCompte) {
                  tab.push({libelle: 'Type compte', valeur: mouvement.typeCompte});
                }
                if (mouvement.libelleCompte) {
                  tab.push({libelle: 'Libellé compte', valeur: mouvement.libelleCompte});
                }

                if (mouvement.numeroCompte) {
                  tab.push({libelle: 'Numéro compte', valeur: mouvement.numeroCompte});
                }

                this.dialog.open(ShowDetailComponent, {
                  width: '500px',
                  data: {
                    title: 'Détails mouvement',
                    details: tab
                  }
                });
              }
            }
        );
  }

  closeDialog(value) {
    this.dialogRef.close(value);
  }

}
