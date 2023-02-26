import { Component, OnInit } from '@angular/core';
import {Parametrage} from '../../_model/parametrage';
import {Constant} from '../../_constant/constant';
import {ParametrageService} from '../../_service/autre/parametrage.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ServerService} from '../../_service/auth/server.service';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {CommunService} from '../../_service/autre/commun.service';

@Component({
  selector: 'app-parametrage',
  templateUrl: './parametrage.component.html',
  styleUrls: ['./parametrage.component.scss']
})
export class ParametrageComponent implements OnInit {

  headers = ['ID', 'Slug', 'Libelle', 'Description'];
  fieldsForSearch;

  parametrages: Parametrage[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedParametrage: Parametrage;
  entities: any[];
  filtres: any[] = [];

  constructor(private parametrageService: ParametrageService,
              private dialog: MatDialog,
              private communService: CommunService,
              private serverService: ServerService) {
  }

  async ngOnInit() {
    this.fieldsForSearch = [
      {name: 'ID', tag: 'id', type: 'in', level: 1},
      {name: 'Slug', tag: 'slug', type: 'contains', level: 2},
      {name: 'Libelle', tag: 'libelle', type: 'contains', level: 3},
    ];

    this.getParametrages(this.currentPage);
  }

  getParametrages(page, filtres = [], exporter = false) {
    this.filtres = filtres;
    this.currentPage = page;
    this.entities = [];

    if (page == null) {
      this.itemsPerPage = null;
    }

    this.parametrageService.findAll(this.currentPage, this.itemsPerPage, filtres).toPromise()
        .then((result) => {
          if (result) {
            this.parametrages = result.data;
            this.totalItems = result.totalItems;
            if (this.parametrages) {
              for (const item of this.parametrages) {
                this.entities.push({object: item, values: [{type: 'id', 'id': item.id}, item.slug, item.libelle, item.description]});
              }
              if (exporter) {
                this.communService.exporter(this.entities, 'parametrages');
              }
            }
            if (exporter || page == null) {
              this.currentPage = 1;
              this.itemsPerPage = 10;
            }
          }
        });

  }

  onDetails(parametrage: Parametrage) {
    this.dialog.open(ShowDetailComponent, {
      width: '500px',
      data: {
        title: 'Détail parametrage',
        details: [
          {libelle: 'Slug', valeur: parametrage.slug},
          {libelle: 'Libelle', valeur: parametrage.libelle},
          {libelle: 'Description', valeur: parametrage.description},
        ]
      }
    });
  }

  onEdit(parametrage: Parametrage) {
    this.selectedParametrage = parametrage;

    this.openEditDialog();
  }

  openEditDialog() {
    let tag;
    let title;

    if (this.selectedParametrage == null) {
      tag = 'add';
      title = 'Ajouter parametrage';
      this.selectedParametrage = new Parametrage();
    } else {
      tag = 'edit';
      title = 'Modifier parametrage';
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = {
      title,
      entity: this.selectedParametrage,
      fields: [
        {label: 'Slug', tag: 'slug', type: 'text', valeur: this.selectedParametrage.slug, required: true, disabled: true},
        {label: 'Libelle', tag: 'libelle', type: 'text', valeur: this.selectedParametrage.libelle, required: true},
        {label: 'Description', tag: 'description', type: 'textarea', valeur: this.selectedParametrage.description, required: true},
      ],
      validate: (entity: Parametrage) => {
        console.log('___ to edit ___');
        console.log(entity);

        this.selectedParametrage.slug    = entity.slug;
        this.selectedParametrage.libelle      = entity.libelle;
        this.selectedParametrage.description      = entity.description;

        if (tag === 'edit') {
          return this.parametrageService.edit(this.selectedParametrage).toPromise()
              .then(
                  (org) => {
                    console.log('____ Parametrage edited ___');
                    console.log(org);
                    return org;
                  },
                  (error) => {
                    console.log('___ Error edit parametrage ___');
                    console.log(error);
                    return error;
                  }
              );
        } else if (tag === 'add') {
          return this.parametrageService.add(this.selectedParametrage).toPromise()
              .then(
                  (org) => {
                    console.log('____ Parametrage added ___');
                    console.log(org);
                    return org;
                  },
                  (error) => {
                    console.log('___ Error add parametrage ___');
                    console.log(error);
                    return error;
                  }
              );
        }
      }
    };

    this.dialog.open(EditEntityComponent, dialogConfig)
        .afterClosed().subscribe((result) => {
      console.log('____ Edit and close dialog parametrage ___');
      console.log(result);
      if (result && result.submit) {
        this.getParametrages(this.currentPage);
      }
    });
  }

  onDelete(parametrage: Parametrage) {
    this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        message: 'Vous allez supprimer cette parametrage?',
        fields: [
          {label: 'Slug', valeur: parametrage.slug},
          {label: 'Libelle', valeur: parametrage.libelle},
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        this.parametrageService.delete(parametrage)
            .subscribe(
                (resp) => {
                  console.log('___ Parametrage deleted ___');
                  console.log(resp);

                  this.getParametrages(this.currentPage);
                }
            );
      }
    });
  }

  exporter(filtres: any[]) {
        this.getParametrages(null, filtres, true);
  }
}
