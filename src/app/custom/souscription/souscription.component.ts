import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import {Souscription} from '../../_model/souscription';
import {Constant} from '../../_constant/constant';
import {SouscriptionService} from '../../_service/autre/souscription.service';
import {ServerService} from '../../_service/auth/server.service';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {CommunService} from '../../_service/autre/commun.service';
import {ProfilFraisEditComponent} from '../profil-frais/profil-frais-edit/profil-frais-edit.component';
import {FormulaireService} from '../../_service/autre/formulaire.service';
import {UserService} from '../../_service/auth/user.service';
import {UsersListComponent} from '../../user/profil/users/users-list/users-list.component';
import {formatNumber} from '@angular/common';

declare var swal;

@Component({
  selector: 'app-souscription',
  templateUrl: './souscription.component.html',
  styleUrls: ['./souscription.component.scss']
})
export class SouscriptionComponent implements OnInit {
  custombuttons = [
      {tag: 'activation', title: 'Activ./Desactiv.', icon: 'fa fa-key'},
      {tag: 'users', title: 'Utilisateurs', icon: 'fa fa-user'},
      {tag: 'profilFrais', title: 'Profil Frais', icon: 'fa fa-check'}
  ];

  headers = ['pays', 'ville', 'adresse', 'code_partenaire', 'type', 'raison_sociale', 'prenom', 'nom', 'solde', 'statut'];
  // headers = [];
  fieldsForSearch = [];
  fieldsForFilter = [];

  souscriptions: Souscription[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedSouscription: any;
  entities: any[];
  filtres: any;

  constructor(private souscriptionService: SouscriptionService,
              private dialog: MatDialog,
              private communService: CommunService,
              private userService: UserService,
              private formulaireService: FormulaireService,
              private serverService: ServerService) {
  }

  async ngOnInit() {
    this.getSouscriptions(this.currentPage);
  }

  getSouscriptions(page, items = this.itemsPerPage, filtres = [], exporter = false) {
    this.filtres = filtres;
    this.currentPage = page;
    this.entities = [];
    this.itemsPerPage = items;

    this.formulaireService.getDatas('souscription').toPromise()
        .then((data: Array<any>) => {
          let tabDatas: Array<any> = [];
          tabDatas = this.filterDetailsCampagne(filtres, data);
          console.log('________________ SOUS LIST ____________________');
          console.log(tabDatas);
          if (tabDatas) {
            const last: Object = tabDatas[tabDatas.length - 1];
              let tabs = [];
            if (last) {
                tabs = Object.keys(last);
            }

            if (this.headers.length === 0) {
                for (const t of tabs) {
                    // tslint:disable-next-line:max-line-length
                    if (t !== 'ninea' && t !== 'telephone' && t !== 'id' && t !== 'email' && t !== 'entite' && t !== 'consomme' && t !== 'rcc' && t !== 'filiale') {
                        this.headers.push(t);
                    }
                }
            }

            // Filter charges
              if (this.fieldsForSearch.length === 0) {
                  let i = 1;
                  for (const head of this.headers) {
                      // tslint:disable-next-line:max-line-length
                      if (head !== 'ninea' && head !== 'telephone' && head !== 'filiale' && head !== 'entite') {
                          this.fieldsForSearch.push(
                              {name: head.toUpperCase(), tag: head, type: 'in', level: i},
                          );
                          i++;
                      }
                  }
              }

            console.log('________________ HEADER ____________________');
            console.log(this.headers);

            if (this.headers.indexOf('statut') === -1) {
              this.headers.push('statut');
            }

            for (const item of tabDatas) {
              const values = [];
              for (const key of this.headers) {
                  if (key === 'statut') {
                      values.push(item[key] === 'v' ? 'VALIDE' : 'NON VALIDE');
                  } else {
                      if (key === 'type') {
                          values.push(item[key] === 'pp' ? 'PERSONNE PHYSIQUE' : 'PERSONNE MORALE');
                      } else {
                          if (key === 'solde') {
                              values.push(formatNumber(item[key], 'fr-FR'));
                          } else {
                              values.push(item[key]);
                          }
                      }
                  }
              }
              this.entities.push({object: item, values});
            }
            if (exporter) {
                this.communService.exporter(this.entities, 'souscriptions');
            }
          }
            if (exporter || page == null) {
                this.currentPage = 1;
                this.itemsPerPage = 10;
            }
        });

  }

    /**
     *
     * @param filtres
     * @param details
     */
    filterDetailsCampagne(filtres: any[], details): Array<any> {
        const filtered_details: any[] = [];
        console.log('Les filtres');
        console.log(filtres);
        console.log('Les souscriptions');
        console.log(details);
        if (filtres) {
            for (const filtre of filtres) {
                details = details.filter(detail => (detail[filtre.tag] + '').toLowerCase().indexOf(filtre.value.toLowerCase()) === 0)
            }
        }
        return details;
    }

  onDetails(souscription: any) {
    console.log('_______________ SOUSCRIPTION DETAILS _______________');
    console.log(souscription);

    const head = Object.keys(souscription);

    const details = [];
    for (const h of head) {
      if (h.toLowerCase() !== 'filiale' && h.toLowerCase() !== 'entite' && h.toLowerCase() !== 'id') {
          if (h.toLowerCase() === 'statut') {
              details.push(
                  {
                      libelle: h.toUpperCase(),
                      valeur: souscription[h].toLowerCase() === 'v' ? 'VALIDE' : 'NON VALIDE'
                  }
              )
          } else {
              if (h.toLowerCase() === 'type') {
                  details.push(
                      {
                          libelle: h.toUpperCase(),
                          valeur: souscription[h].toLowerCase() === 'pp' ? 'PERSONNE PHYSIQUE' : 'PERSONNE MORALE'
                      }
                  )
              } else {
                  details.push(
                      {
                          libelle: h.toUpperCase(),
                          valeur: souscription[h]
                      }
                  )
              }
          }

      }
    }

    this.dialog.open(ShowDetailComponent, {
      width: '500px',
      data: {
        title: 'Détail souscription',
        details: details
      }
    });
  }

  onEdit(souscription: any) {
    this.selectedSouscription = souscription;
    this.openEditDialog();
  }

  openEditDialog() {
    let tag;
    let title;

    this.formulaireService.findFormulaireDetails('souscription').toPromise()
        .then(
            (sousForm: any) => {
              console.log('formulaire de souscription');
              console.log(sousForm);

              // Update for code souscription add/edit
              const champsSouscription = [];

              for (const formDataSous of sousForm.formulaireItems) {
                for (const formChampsSous of formDataSous.champs) {
                  // tslint:disable-next-line:triple-equals
                  if (formChampsSous.visible) {
                    champsSouscription.push(formChampsSous);
                  }
                }
              }

              console.log('______________ LISTE CHAMPS RECU ___________________');
              console.log(champsSouscription);

              if (this.selectedSouscription == null) {
                tag = 'add';
                title = 'Ajouter souscription';
                this.selectedSouscription = new Souscription();
              } else {
                tag = 'edit';
                title = 'Modifier souscription';
              }

              console.log('____________ SOUSCRIPTION UPDATE __________');
              console.log(this.selectedSouscription);

              const fieldsSous = [];
              for (const fieldChamp of champsSouscription) {
                if (fieldChamp.type === 'select') {
                  const opts = [];
                  for (const opt of JSON.parse(fieldChamp.optionsValue)) {
                    opts.push(
                        {
                          label: opt.label,
                          value: opt.valeur
                        }
                    );
                  }

                  fieldsSous.push(
                      // tslint:disable-next-line:max-line-length
                      {label: fieldChamp.label, tag: fieldChamp.slug, type: fieldChamp.type, valeur: this.selectedSouscription[fieldChamp.slug], required: false, options: opts},
                  );
                } else {
                  fieldsSous.push(
                      // tslint:disable-next-line:max-line-length
                      {label: fieldChamp.label, tag: fieldChamp.slug, type: fieldChamp.type, valeur: this.selectedSouscription[fieldChamp.slug], required: false},
                  );
                }
              }

              const dialogConfig = new MatDialogConfig();
              dialogConfig.width = '600px';
              dialogConfig.data = {
                title,
                entity: this.selectedSouscription,
                fields: fieldsSous,
                validate: (entity: any) => {
                  console.log('______________ ID SOUS : ', this.selectedSouscription.id);
                  entity.id = this.selectedSouscription.id;
                  console.log(entity);
                  if (tag === 'edit') {
                    return this.souscriptionService.updateFormulaireData(entity, 'souscription').toPromise()
                        .then(
                            (org) => {
                              return org;
                            },
                            (error) => {
                              return error;
                            }
                        );
                  } else if (tag === 'add') {
                    return this.souscriptionService.addFormulaireData(entity, 'souscription').toPromise()
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
                  this.getSouscriptions(this.currentPage);
                }
              });
        });
  }

  onDelete(souscription: Souscription) {
    this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        message: 'Vous allez supprimer ce souscription?',
        fields: [
          {label: 'Souscription', valeur: souscription.nom}
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        this.souscriptionService.delete(souscription)
            .subscribe(
                (resp) => {
                  this.getSouscriptions(this.currentPage);
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
    const tag = event.tag;
    const souscription: any = event.entity;
    switch (tag) {
        case 'profilFrais':
            const dialog = this.dialog.open(ProfilFraisEditComponent, {
              width: '850px',
              data: {
                souscription
              }
            });
            dialog.afterClosed().subscribe(val => {
              if (val === 'success') {
                this.getSouscriptions(this.currentPage, this.filtres);
              }
            });
            break;
        case 'activation':
            this.activateOrDesactivateSouscription(souscription);
            break;
        case 'users':
            this.dialog.open(UsersListComponent, {
                data: {
                    souscription: souscription.id,
                    isDialog: true
                }
            }).afterClosed().subscribe(result => {
            });
            /*this.userService.getUsersBySouscriptionId(souscription.id).toPromise()
                .then(
                    (users) => {
                        console.log('-----------------------');
                        console.log(users);
                        console.log('-----------------------');
                    }
                );*/
            break;
        default:
            break;
    }
  }

  activateOrDesactivateSouscription(souscription: any) {
      this.dialog.open(ConfirmDeleteComponent, {
          width: '400px',
          data: {
              title: souscription.statut === 'nv' ? 'Activation' : 'Désactivation',
              // tslint:disable-next-line:max-line-length
              message: souscription.statut === 'nv' ? 'Voulez-vous activer cette souscription?' : 'Voulez-vous désactiver cette souscription?',
              fields: [
                  {label: 'Souscription', valeur: souscription.id}
              ]
          }
      }).afterClosed().subscribe(result => {
          if (!result.canceled) {
              const message = souscription.statut === 'nv' ? 'Activation avec succès' : 'Désactivation avec succès';
              souscription.statut = souscription.statut === 'nv' ? 'v' : 'nv';
              this.souscriptionService.updateFormulaireData(souscription, 'souscription').toPromise()
                  .then(
                      (resp) => {
                          this.getSouscriptions(this.currentPage);
                          swal({
                              'icon': 'success',
                              'text': message
                          })
                      }
                  );
          }
      });
  }

  exporter(filtres: any) {
      this.getSouscriptions(null, null, filtres, true);
  }

}
