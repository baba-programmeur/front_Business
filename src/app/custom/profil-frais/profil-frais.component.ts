import { Component, OnInit } from '@angular/core';
import {Constant} from '../../_constant/constant';
import {ServerService} from '../../_service/auth/server.service';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {ProfilFrais} from '../../_model/profil-frais';
import {ProfilFraisService} from '../../_service/autre/profil-frais.service';
import {ConfirmComponent} from '../global/confirm/confirm.component';
import {ProfilFraisValeurComponent} from './profil-frais-valeur/profil-frais-valeur.component';
import {CommunService} from '../../_service/autre/commun.service';

@Component({
  selector: 'app-profil-frais',
  templateUrl: './profil-frais.component.html',
  styleUrls: ['./profil-frais.component.scss']
})
export class ProfilFraisComponent implements OnInit {
  headers = ['Partenaire', 'Type', 'Opération', 'Canal', 'Actif'];
  custombuttons = [
    {tag: 'details', title: 'Valeurs', icon: 'fa fa-adjust'}
  ];
  fieldsForSearch;
  fieldsForFiltre;

  profilFraiss: ProfilFrais[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedProfilFrais: ProfilFrais;
  entities: any[];
  filtres: any[];

  constructor(private profilFraisService: ProfilFraisService,
              private dialog: MatDialog,
              private communService: CommunService,
              private serverService: ServerService) {
  }

  async ngOnInit() {
    this.fieldsForSearch = [
      {name: 'Partenaire', tag: 'codePartenaire', type: 'contains', level: 1},
      {name: 'Type', tag: 'type', type: 'contains', level: 2},
      {name: 'Canal', tag: 'canalLibelle', type: 'contains', level: 3},
      {name: 'Operation', tag: 'typeOperation', type: 'contains', level: 4},
    ];

    this.fieldsForFiltre = [
      {name: 'Actif', tag: 'statut', type: 'in', onGetFieldOptions: () => {
        return new Promise(resolve => {
          resolve([{libelle: 'OUI', value: 'A'}, {libelle: 'NON', value: 'D'}]);
        })
      }},
    ];

    this.getProfilFraiss(this.currentPage);
  }

  getProfilFraiss(page, items = this.itemsPerPage, filtres = [], exporter = false) {
    this.currentPage = page;
    this.entities = [];
    this.filtres = filtres;
    this.itemsPerPage = items;

    this.profilFraisService.findAll(this.currentPage, this.itemsPerPage, filtres).toPromise()
        .then((result) => {

          if (result) {
            this.profilFraiss = result.data;
            this.totalItems = result.totalItems;
            if (this.profilFraiss) {
              for (const item of this.profilFraiss) {
                // tslint:disable-next-line:max-line-length
                this.entities.push({object: item, values: [item.codePartenaire, item.type, item.typeOperation, item.canalLibelle, (item.statut === 'A') ? 'OUI' : 'NON']});
              }
              if (exporter) {
                this.communService.exporter(this.entities, 'profil-frais')
              }
            }
            if (exporter || items == null) {
              this.currentPage = 1;
              this.itemsPerPage = 10;
            }
          }
        });
  }

  onDetails(profilFrais: ProfilFrais) {
    this.dialog.open(ShowDetailComponent, {
      width: '500px',
      data: {
        title: 'Détail profilFrais',
        details: [
          {libelle: 'Type', valeur: profilFrais.type},
          {libelle: 'Code Partenaire', valeur: profilFrais.codePartenaire},
          {libelle: 'Type Opération', valeur: profilFrais.typeOperation},
          {libelle: 'Canal', valeur: profilFrais.canalLibelle},
          {libelle: 'Actif', valeur: (profilFrais.statut === 'A') ? 'OUI' : 'NON'},
        ]
      }
    });
  }

  onEdit(profilFrais: ProfilFrais) {
    this.selectedProfilFrais = profilFrais;
    this.openEditDialog();
  }

  openEditDialog() {
    let tag;
    let title;

    if (this.selectedProfilFrais == null) {
      tag = 'add';
      title = 'Ajouter profilFrais';
      this.selectedProfilFrais = new ProfilFrais();
    } else {
      tag = 'edit';
      title = 'Modifier profilFrais';
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = {
      title,
      entity: this.selectedProfilFrais,
      fields: [
        {label: 'Libellé', tag: 'libelle', type: 'text', valeur: this.selectedProfilFrais.libelle, required: true},
        {label: 'Actif', tag: 'statut', type: 'select', valeur: this.selectedProfilFrais.statut, required: true, options: [
            {label: 'OUI', value: 'A'},
            {label: 'NON', value: 'D'},
          ],
        onChange: () => {}},
      ],
      validate: (entity: ProfilFrais) => {
        this.selectedProfilFrais.libelle = entity.libelle;

        if (tag === 'edit') {
          return this.profilFraisService.edit(this.selectedProfilFrais).toPromise()
              .then(
                  (org) => {
                    return org;
                  },
                  (error) => {
                    return error;
                  }
              );
        } else if (tag === 'add') {
          return this.profilFraisService.add(this.selectedProfilFrais).toPromise()
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
        this.getProfilFraiss(this.currentPage);
      }
    });
  }

  onDelete(profilFrais: ProfilFrais) {
    this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        message: 'Vous allez supprimer ce profilFrais?',
        fields: [
          {label: 'Type', valeur: profilFrais.type},
          {label: 'Code Partenaire', valeur: profilFrais.codePartenaire},
          {label: 'Canal', valeur: profilFrais.canalLibelle},
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        this.profilFraisService.delete(profilFrais)
            .subscribe(
                (resp) => {
                  this.getProfilFraiss(this.currentPage);
                }
            );
      }
    });
  }

  onCustomButton(event) {
    // Mise en place de la gestion des boutons customisés
    console.log('___ Custom button ___');
    console.log(event);
    const tag = event.tag;
    const detail: any = event.entity;

    if (tag === 'details') {
      console.log('Transaction à renvoyer');
      console.log(detail);
      this.dialog.open(ProfilFraisValeurComponent, {
        width: '450px',
        data: {
          details: detail
        }
      }).afterClosed().subscribe(result => {
        if (!result.canceled) {
          console.log('fermer');
        }
      });
    } else {
      console.log('Option pas encore disponible');
    }
  }

  exporter(filtres: any[]) {
    this.getProfilFraiss(null, null, filtres, true);
  }
}
