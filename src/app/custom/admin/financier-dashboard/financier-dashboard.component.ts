import { Component, OnInit } from '@angular/core';
import {Mouvement} from '../../../_model/mouvement';
import {Constant} from '../../../_constant/constant';
import {MouvementService} from '../../../_service/autre/mouvement.service';
import {CommunService} from '../../../_service/autre/commun.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ShowDetailComponent} from '../../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../../global/confirm-delete/confirm-delete.component';
import {Souscription} from '../../../_model/souscription';
import {SouscriptionService} from '../../../_service/autre/souscription.service';
import {ConfirmMouvementComponent} from '../../global/confirm-mouvement/confirm-mouvement.component';
import {CancelMouvementComponent} from './cancel-mouvement/cancel-mouvement.component';
import {CorrectMouvementComponent} from './correct-mouvement/correct-mouvement.component';
import {FormulaireService} from '../../../_service/autre/formulaire.service';

declare var swal;

@Component({
  selector: 'app-financier-dashboard',
  templateUrl: './financier-dashboard.component.html',
  styleUrls: ['./financier-dashboard.component.scss']
})
export class FinancierDashboardComponent implements OnInit {
  custombuttons = [
    {tag: 'cancel', title: 'Annuler', icon: 'fa fa-trash'},
    // {tag: 'correct', title: 'Corriger montant', icon: 'fa fa-money'},
  ];

  headers = ['ID', 'Référence', 'Type mouvement', 'Etat mouvement', 'ID Partenaire', {type: 'montant', val: 'Montant'}];
  fieldsForSearch;
  fieldsForFilter;

  mouvements: Mouvement[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedMouvement: Mouvement;
  entities: any[];
  filters: any[];

  constructor(private mouvementService: MouvementService,
              private communService: CommunService,
              private souscriptionService: SouscriptionService,
              private formulaireService: FormulaireService,
              private dialog: MatDialog) {
  }

  async ngOnInit() {
    this.fieldsForSearch = [
      {name: 'ID', tag: 'id', type: 'in', level: 1},
      {name: 'Référence', tag: 'reference', type: 'contains', level: 2},
      {name: 'Montant', tag: 'montant', type: 'in', level: 3},
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

  getMouvements(page, filters = null, exporter = false) {
    this.filters = filters;

    this.currentPage = page;
    this.entities = [];

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
                if (item.type === 'CREDIT') {typeBackground  = '#4680ff'}
                if (item.type === 'DEBIT') {typeBackground = '#FFB64D'}

                if (item.etat === 'ANNULE') {etatBackground  = 'red'}
                if (item.etat === 'VALIDE') {etatBackground  = '#93BE52'}

                this.entities.push({
                  object: item,
                  values: [
                    {type: 'id', 'id': item.id},
                    item.reference,
                    {type: 'statut', statut: item.type.toLowerCase(), background: typeBackground},
                    {type: 'statut', statut: item.etat, background: etatBackground},
                    item.souscriptionId,
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

  onEdit(mouvement: Mouvement) {
    this.selectedMouvement = mouvement;
    this.openEditDialog();
  }

  async openEditDialog() {
    let tag;
    let title;

    let selectedCodePartenaire = '';
    const partenaireOptions = [];

    await this.formulaireService.getDatas('souscription').toPromise()
        .then((resp: any[]) => {
          console.log('__ Partenaire');
          console.log(resp);
          if (resp) {
            console.log('---- Liste des souscriptions ----');
            console.log(resp);
            for (const item of resp) {
              partenaireOptions.push({label: item.code_partenaire, value: item.id});
              if (this.selectedMouvement && this.selectedMouvement.souscriptionId === item.id) {
                selectedCodePartenaire = item.code_partenaire;
              }
            }

            console.log ('____ Selected souscription');
            console.log (selectedCodePartenaire);


            if (this.selectedMouvement == null) {
              tag = 'add';
              title = 'Ajouter mouvement';
              this.selectedMouvement = new Mouvement();
            } else {
              tag = 'edit';
              title = 'Modifier mouvement';
            }

            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = '450px';
            dialogConfig.data = {
              title,
              entity: this.selectedMouvement,
              fields: [
                {
                  label: 'Type mouvement', tag: 'type', type: 'select', valeur: this.selectedMouvement.type, required: true, options: [
                    {label: 'CREDIT', value: 'CREDIT'},
                    {label: 'DEBIT', value: 'DEBIT'},
                  ],
                  onChange: () => {}
                },
                {
                  // tslint:disable-next-line:max-line-length
                  label: 'Code partenaire', tag: 'codeEs', type: 'select', valeur: selectedCodePartenaire, required: true, options: partenaireOptions,
                  onChangeSearch: ()  => {},
                  onChange: ()  => {},
                },
                {label: 'Référence', tag: 'reference', type: 'text', valeur: this.selectedMouvement.reference, required: true},
                {label: 'Montant', tag: 'montant', type: 'number', valeur: this.selectedMouvement.montant, required: true},
                {
                  label: 'Type de compte', tag: 'typeCompte', type: 'select', valeur: this.selectedMouvement.typeCompte, required: true,
                  options: [
                    {label: 'Banque', value: 'BANQUE'},
                    {label: 'Wallet', value: 'WALLET'},
                    {label: 'Chéque', value: 'CHEQUE'}
                  ],
                  onChange: () => {}
                },
                {label: 'Libelle compte', tag: 'libelleCompte', type: 'text', valeur: this.selectedMouvement.libelleCompte, required: true},
                {label: 'Numéro compte', tag: 'numeroCompte', type: 'text', valeur: this.selectedMouvement.numeroCompte, required: false},
                {label: 'Date mouvement', tag: 'dateVersement', type: 'date', valeur: this.selectedMouvement.dateVersement, required: true},
              ],
              validate: (entity: any) => {
                console.log('___ mouvement');
                console.log(entity);

                this.selectedMouvement.reference       = entity.reference;
                this.selectedMouvement.type            = entity.type;
                this.selectedMouvement.montant         = entity.montant;
                this.selectedMouvement.typeCompte      = entity.typeCompte;
                this.selectedMouvement.libelleCompte   = entity.libelleCompte;
                this.selectedMouvement.numeroCompte    = entity.numeroCompte;
                this.selectedMouvement.dateVersement   = entity.dateVersement;
                this.selectedMouvement.etat            = 'VALIDE';
                this.selectedMouvement.userId          = '';

                if (tag === 'edit') {
                  return this.mouvementService.edit(this.selectedMouvement).toPromise()
                      .then(
                          (org) => {
                            console.log('____ Mouvement edited ___');
                            console.log(org);
                            return org;
                          });
                } else if (tag === 'add') {
                  // find souscription by code
                  return this.formulaireService.getDatasByValueKey('souscription', entity.codeEs, 'code_partenaire').toPromise()
                      .then(
                          (souscriptions: any[]) => {
                            if (souscriptions && souscriptions.length !== 0) {
                              const souscription = souscriptions.find(e => e.id + '' === entity.codeEs);
                              console.log('Souscription');
                              console.log(souscriptions);
                              console.log('Entity');
                              console.log(entity);
                              this.selectedMouvement.souscriptionId = souscription.id;

                              const dialogConfirm = this.dialog.open(ConfirmMouvementComponent, {
                                width: '450px',
                                data: {
                                  souscription: souscription,
                                  mouvement: this.selectedMouvement
                                }
                              });
                              return dialogConfirm.afterClosed().toPromise().then(
                                  result => {
                                    console.log('___ canceled');
                                    console.log(result);

                                    if (result && !result.canceled) {
                                      return this.mouvementService.add(this.selectedMouvement).toPromise()
                                          .then(
                                              (org) => {
                                                console.log('____ Mouvement added ___');
                                                console.log(org);
                                                return org;
                                              });
                                    }
                                  }
                              );
                            } else {
                              swal({
                                icon: 'warning',
                                text: 'Partenaire non trouvé'
                              });
                            }
                          }
                      );

                }
              }
            };

            this.dialog.open(EditEntityComponent, dialogConfig)
                .afterClosed().subscribe((result) => {
              console.log('____ Edit and close dialog mouvement ___');
              console.log(result);
              if (result && result.submit) {
                this.getMouvements(this.currentPage);
              }
            });
          }
          return resp;
        });
  }

  onDelete(mouvement: Mouvement) {

    this.souscriptionService.findById(mouvement.souscriptionId)
        .subscribe(
            (souscription: any) => {
              if (souscription) {
                let partenaire;
                if (souscription.raison_sociale !== '') {
                  partenaire = souscription.raison_sociale;
                } else {
                  partenaire = souscription.prenom + ' ' + souscription.nom;
                }

                this.dialog.open(ConfirmDeleteComponent, {
                  width: '400px',
                  data: {
                    message: 'Vous allez supprimer ce mouvement?',
                    fields: [
                      {label: 'Référence', valeur: mouvement.reference},
                      {label: 'Type', valeur: mouvement.type},
                      {label: 'Montant', valeur: mouvement.montant},
                      {label: 'Code partenaire', valeur: souscription.code_partenaire},
                      {label: 'Partenaire', valeur: partenaire},
                    ]
                  }
                }).afterClosed().subscribe(result => {
                  if (!result.canceled) {
                    this.mouvementService.delete(mouvement)
                        .subscribe(
                            (resp) => {
                              console.log('___ Mouvement deleted ___');
                              console.log(resp);

                              this.getMouvements(this.currentPage);
                            }
                        );
                  }
                });

              }
            }
          );
  }

  /**
   * Gestion boutons supplément dans la liste
   *
   * @param event
   */
  onCustomButton(event) {
    console.log('___ Custom button ___');
    console.log(event);
    const tag = event.tag;
    const mouvement: Mouvement = event.entity;
    let dialog;

    switch (tag) {
      case 'cancel':
        this.souscriptionService.findById(mouvement.souscriptionId)
            .subscribe(
                (souscription: any) => {
                  if (souscription) {
                    let partenaire;
                    if (souscription.raison_sociale !== '') {
                      partenaire = souscription.raison_sociale;
                    } else {
                      partenaire = souscription.prenom + ' ' + souscription.nom;
                    }
                    dialog = this.dialog.open(CancelMouvementComponent, {
                        width: '400px',
                        data: {
                          mouvement,
                          codePartenaire: souscription.code_partenaire,
                          partenaire
                        }
                      });

                    dialog.afterClosed().subscribe(result => {
                        if (!result.canceled) {
                          this.mouvementService.cancel(mouvement)
                              .subscribe(
                                  resp => {
                                    console.log('___ Mouvement canceled !!');
                                    this.getMouvements(this.currentPage, this.filters);
                                  }
                              );
                        }
                      });
                  }
              }
            );

        break;
      // case 'correct':
      //   dialog = this.dialog.open(CorrectMouvementComponent, {
      //     width: '450px',
      //     data: {
      //       mouvement
      //     }
      //   });
      //
      //   dialog.afterClosed().subscribe(result => {
      //     if (!result.canceled) {
      //       this.getMouvements(this.currentPage, this.filters);
      //     }
      //   });
      //   break;
      default:
        break;
    }
  }

  exporter(filters: any[]) {
    this.getMouvements(null, filters, true);
  }
}
