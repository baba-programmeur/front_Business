import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import {Formulaire} from '../../_model/formulaire';
import {Constant} from '../../_constant/constant';
import {FormulaireService} from '../../_service/autre/formulaire.service';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {FormulaireItemComponent} from './formulaire-item/formulaire-item.component';
import {TypeCanal} from '../../_model/type-canal';
import {Form} from '@angular/forms';
import {CommunService} from '../../_service/autre/commun.service';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss']
})
export class FormulaireComponent implements OnInit {
  custombuttons = [
    {tag: 'champs', title: 'Gestion des champs', icon: 'fa fa-wpforms'}
  ];

  headers = ['Slug', 'Description'];
  fieldsForSearch;

  formulaires: Formulaire[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedFormulaire: Formulaire;
  entities: any[];
  filtres: any[] = [];

  constructor(private formulaireService: FormulaireService,
              private communService: CommunService,
              private dialog: MatDialog) {
  }

  async ngOnInit() {
    this.fieldsForSearch  = [
      {name: 'Slug', tag: 'slug', type: 'contains', level: 1}
    ];

    this.getFormulaires(this.currentPage);
  }

  getFormulaires(page, filtres = [], exporter = false) {
    this.filtres = filtres;
    this.currentPage = page;
    this.entities = [];

    if(page == null) {
      this.itemsPerPage = null;
    }

    this.formulaireService.findAll(this.currentPage, this.itemsPerPage, filtres).toPromise()
        .then((result) => {

          if (result) {
            this.formulaires = result.data;
            this.totalItems = result.totalItems;
            if (this.formulaires) {
              for (const item of this.formulaires) {
                this.entities.push({
                  object: item,
                  values: [
                    item.slug,
                    item.description
                  ]});
              }
              if (exporter) {
                this.communService.exporter(this.entities, 'formulaires')
              }
            }
            if (exporter || page == null) {
              this.currentPage = 1;
              this.itemsPerPage = 10;
            }
          }
        });

  }

  onEdit(formulaire: Formulaire) {
    this.selectedFormulaire = formulaire;

    this.openEditDialog();
  }

  openEditDialog() {
    let tag;
    let title;

    console.log('________________________ JESUISLA ________________________');

    if (this.selectedFormulaire == null) {
      tag = 'add';
      title = 'Ajouter un formulaire';
      this.selectedFormulaire = new Formulaire();
    } else {
      tag = 'edit';
      title = 'Modifier le formulaire';
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = {
      title,
      entity: this.selectedFormulaire,
      fields: [
        {label: 'Slug', tag: 'slug', type: 'text', valeur: this.selectedFormulaire.slug, required: true},
        {label: 'Description', tag: 'description', type: 'text', valeur: this.selectedFormulaire.description, required: true}
      ],
      validate: (entity: Formulaire) => {
        this.selectedFormulaire.slug = entity.slug;
        this.selectedFormulaire.description   = entity.description;
        if (tag === 'edit') {
          return this.formulaireService.edit(this.selectedFormulaire).toPromise()
              .then(
                  (org) => {
                    return org;
                  });
        } else if (tag === 'add') {
          return this.formulaireService.add(this.selectedFormulaire).toPromise()
              .then(
                  (org) => {
                    return org;
                  });
        }
      }
    };

    this.dialog.open(EditEntityComponent, dialogConfig)
        .afterClosed().subscribe((result) => {
      console.log('____ Edit and close dialog formulaire ___');
      console.log(result);
      if (result && result.submit) {
        this.getFormulaires(this.currentPage);
      }
    });
  }

  onDetails(formulaire: Formulaire) {
    this.dialog.open(ShowDetailComponent, {
      width: '500px',
      data: {
        title: 'Détail formulaire',
        details: [
          {libelle: 'Slug', valeur: formulaire.slug},
          {libelle: 'Description', valeur: formulaire.description},
        ]
      }
    });
  }

  onDelete(formulaire: Formulaire) {
    this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        message: 'Vous allez supprimer ce formulaire?',
        fields: [
          {label: 'Slug', valeur: formulaire.slug},
          {label: 'Description', valeur: formulaire.description}
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        this.formulaireService.delete(formulaire)
            .subscribe(
                (resp) => {
                  this.getFormulaires(this.currentPage);
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
    const tag        = event.tag;
    const formulaire: Formulaire = event.entity;

    switch (tag) {
      case 'champs':
        let dialog = this.dialog.open(FormulaireItemComponent, {
          width: '1200px',
          data: {
            formulaire
          }
        });

        dialog.afterClosed().subscribe(val => {
          if (val == 'success') {
            this.getFormulaires(this.currentPage, this.filtres);
          }
        });
        break;
      default:
        break;
    }
  }

  exporter(filtres: any[]) {
    this.getFormulaires(null, filtres, true);
  }
}
