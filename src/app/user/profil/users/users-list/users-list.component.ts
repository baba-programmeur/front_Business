import {Component, Inject, OnInit} from '@angular/core';
import {Constant} from '../../../../_constant/constant';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {CommunService} from '../../../../_service/autre/commun.service';
import {ShowDetailComponent} from '../../../../custom/global/show-detail/show-detail.component';
import {EditEntityComponent} from '../../../../custom/global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../../../../custom/global/confirm-delete/confirm-delete.component';
import {UserService} from '../../../../_service/auth/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  headers = ['login', 'prenom', 'nom', 'email', 'statut'];
  fieldsForSearch;
  fieldsForFilter;

  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedUser: any;
  entities: any[];
  souscriptionId: number;
  filtres: any[] = [];
  isDialog = false;

  constructor(public dialogRef: MatDialogRef<UsersListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userService: UserService,
              private dialog: MatDialog,
              private communService: CommunService) {
    if (data) {
      this.souscriptionId = data.souscription;
      if (data.isDialog) {
        this.isDialog = data.isDialog;
      }
    }
  }

  async ngOnInit() {
    this.fieldsForSearch = [
      {name: 'Prénom', tag: 'firstname', type: 'contains', level: 1},
      {name: 'Nom', tag: 'lastname', type: 'contains', level: 2},
      {name: 'Email', tag: 'email', type: 'contains', level: 3},
    ];
    /*
    this.fieldsForFilter = [
      {
        name: "Code partenaire",
        tag: 'esp',
        type: 'in',
        onGetFieldOptions: () => {
          return this.communService.getCodePartenaires().toPromise().then(
              resp => {
                return resp;
              }
          )
        }
      },
      {
        name: "Statut",
        tag: 'payer',
        type: 'in',
        onGetFieldOptions: () => {
          return this.communService.getStatutsDetailsCampagne().toPromise().then(
              resp => {
                return resp;
              }
          )
        }
      },
    ];
    */
    this.getUsers(this.currentPage);
  }

  getUsers(page, filtres = []) {
    this.filtres = filtres;
    this.currentPage = page;
    this.entities = [];
    this.userService.getUsersBySouscriptionId(this.souscriptionId).toPromise()
        .then(
            (datas: any[]) => {
              console.log('-----------------------');
              console.log(datas);
              console.log('-----------------------');
              for (const item of datas) {
                this.entities.push(
                    {object: item, values: [
                        {type: 'id', 'id': item.username},
                        item.firstName,
                        item.lastName,
                        item.email,
                        item.enabled ? 'ACTIVE' : 'DESACTIVE'
                      ]
                    }
                );
              }
            }
        )
  }

  onDetails(user: any) {
    console.log('_______________ DETAILS CAMPAGNE DETAILS _______________');
    console.log(user);

    this.dialog.open(ShowDetailComponent, {
      width: '500px',
      data: {
        title: 'Détails utilisateur ' + user.username,
        details: [
          {libelle: 'LOGIN', valeur: user.username},
          {libelle: 'PRENOM', valeur: user.firstName},
          {libelle: 'NOM', valeur: user.lastName},
          {libelle: 'EMAIL', valeur: user.email}
        ]
      }
    });
  }

  onEdit(user: any) {
    this.selectedUser = user;

    this.openEditDialog();
  }

  openEditDialog() {
    let tag;
    let title;

    if (this.selectedUser == null) {
      tag = 'add';
      title = 'Ajouter user';
      this.selectedUser = {};
    } else {
      tag = 'edit';
      title = 'Modifier user';
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = {
      title,
      entity: this.selectedUser,
      fields: [
        {label: 'Id client', tag: 'idclt', type: 'text', valeur: this.selectedUser.idclt, required: true},
        {label: 'Prénom', tag: 'prenomclt', type: 'text', valeur: this.selectedUser.prenomclt, required: true},
        {label: 'Nom', tag: 'nomclt', type: 'text', valeur: this.selectedUser.nomclt, required: true},
        {label: 'Téléphone', tag: 'telclt', type: 'text', valeur: this.selectedUser.telclt, required: true},
        {label: 'Adresse mail', tag: 'mailclt', type: 'text', valeur: this.selectedUser.mailclt, required: true},
        {label: 'Montant', tag: 'mnt', type: 'text', valeur: this.selectedUser.mnt, required: true},
      ],
      validate: (entity: any) => {
        this.selectedUser.nomclt     = entity.nomclt;

        if (tag === 'edit') {
          return this.userService.edit(this.selectedUser).toPromise()
              .then(
                  (org) => {
                    return org;
                  },
                  (error) => {
                    return error;
                  }
              );
        } else if (tag === 'add') {
          return this.userService.add(this.selectedUser).toPromise()
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
        this.getUsers(this.currentPage);
      }
    });
  }

  onDelete(user: any) {
    const montant = +user.mnt;

    this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        message: 'Vous allez supprimer ce user?',
        fields: [
          {label: 'Id Client', valeur: user.idclt},
          {label: 'Prénom', valeur: user.prenomclt},
          {label: 'Nom', valeur: user.nomclt},
          {label: 'Montant', valeur: montant.toLocaleString('fr-FR')},
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        this.userService.delete(user)
            .subscribe(
                (resp) => {
                  this.getUsers(this.currentPage);
                }
            );
      }
    });
  }

  onClose(val) {
    this.dialogRef.close(val);
  }
}
