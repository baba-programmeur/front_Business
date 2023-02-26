import { Component, OnInit } from '@angular/core';
import {Constant} from '../../_constant/constant';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ServerService} from '../../_service/auth/server.service';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {Authorisation} from '../../_model/authorisation';
import {AuthorisationService} from '../../_service/autre/authorisation.service';

@Component({
  selector: 'app-authorisation',
  templateUrl: './authorisation.component.html',
  styleUrls: ['./authorisation.component.scss']
})
export class AuthorisationComponent implements OnInit {
  headers = ['ID', 'Code', 'Libelle', 'Endpoint', 'Method'];
  fieldsForSearch;
  authorisation: Authorisation[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedAuthorisation: Authorisation;
  entities: any[];
  filtres: any[] = [];

  constructor(private authorisationService: AuthorisationService,
              private dialog: MatDialog,
              private serverService: ServerService) {
  }

  async ngOnInit() {
    this.fieldsForSearch = [
      {name: 'ID', tag: 'id', type: 'in', level: 1},
      {name: 'Code', tag: 'code', type: 'contains', level: 2},
      {name: 'Libelle', tag: 'libelle', type: 'in', level: 3},
      {name: 'Endpoint', tag: 'endpoint', type: 'in', level: 4},
      {name: 'Method', tag: 'method', type: 'in', level: 5}
    ];

    this.getAllAuthorisation(this.currentPage);
  }

  getAllAuthorisation(page, filtres = []) {
    this.currentPage = page;
    this.entities = [];
    this.filtres = filtres;

    this.authorisationService.findAll(this.currentPage, this.itemsPerPage, filtres).toPromise()
        .then((result) => {

          if (result) {
            this.authorisation = result.data;
            this.totalItems = result.totalItems;
            if (this.authorisation) {
              for (const item of this.authorisation) {
                this.entities.push({object: item, values: [{type: 'id', 'id': item.id}, item.code, item.libelle, item.endpoint, item.method]});
              }
            }
          }
        });
  }

  onDetails(authorisation: Authorisation) {
    this.dialog.open(ShowDetailComponent, {
      width: '500px',
      data: {
        title: 'Détail authorisation ',
        details: [
          {libelle: 'Code', valeur: authorisation.code},
          {libelle: 'Libelle', valeur: authorisation.libelle},
          {libelle: 'Endpoint', valeur: authorisation.endpoint},
          {libelle: 'Method', valeur: authorisation.method},
        ]
      }
    });
  }

  onEdit(authorisation: Authorisation) {
    this.selectedAuthorisation = authorisation;

    this.openEditDialog();
  }

  openEditDialog() {
    let tag;
    let title;

    if (this.selectedAuthorisation == null) {
      tag = 'add';
      title = 'Ajouter authorisation';
      this.selectedAuthorisation = new Authorisation();
    } else {
      tag = 'edit';
      title = 'Modifier authorisation';
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = {
      title,
      entity: this.selectedAuthorisation,
      fields: [
        {label: 'Code', tag: 'code', type: 'text', valeur: this.selectedAuthorisation.code, required: true},
        {label: 'Libelle', tag: 'libelle', type: 'text', valeur: this.selectedAuthorisation.libelle, required: true},
        {label: 'Endpoint', tag: 'endpoint', type: 'text', valeur: this.selectedAuthorisation.endpoint, required: false},
        {label: 'Method', tag: 'method', type: 'text', valeur: this.selectedAuthorisation.method, required: false},
      ],
      validate: (entity: Authorisation) => {
        this.selectedAuthorisation.code       = entity.code;
        this.selectedAuthorisation.libelle    = entity.libelle;
        this.selectedAuthorisation.endpoint   = entity.endpoint;
        this.selectedAuthorisation.method     = entity.method;

        if (tag === 'edit') {
          return this.authorisationService.edit(this.selectedAuthorisation).toPromise()
              .then(
                  (org) => {
                    return org;
                  },
                  (error) => {
                    return error;
                  }
              );
        } else if (tag === 'add') {
          return this.authorisationService.add(this.selectedAuthorisation).toPromise()
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
        this.getAllAuthorisation(this.currentPage);
      }
    });
  }

  onDelete(authorisation: Authorisation) {
    this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        message: 'Vous allez supprimer ce authorisation?',
        fields: [
          {label: 'Authorisation', valeur: authorisation.code}
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        this.authorisationService.delete(authorisation)
            .subscribe(
                (resp) => {
                  this.getAllAuthorisation(this.currentPage);
                }
            );
      }
    });
  }
}
