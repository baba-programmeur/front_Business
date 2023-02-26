import { Component, OnInit } from '@angular/core';
import {Constant} from '../../_constant/constant';
import {NotificationService} from '../../_service/autre/notification.service';
import {Notification} from '../../_model/notification';
import {ServerService} from '../../_service/auth/server.service';
import {ShowDetailComponent} from '../global/show-detail/show-detail.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditEntityComponent} from '../global/edit-entity/edit-entity.component';
import {ConfirmDeleteComponent} from '../global/confirm-delete/confirm-delete.component';
import {CommunService} from '../../_service/autre/commun.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  headers = ['ID', 'Date', 'Id client', 'Id user', 'Id campagne', 'Téléphone', 'SMS'];
  fieldsForSearch;

  notifications: Notification[];
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  totalItems: number;
  selectedNotification: Notification;
  entities: any[];
  filtres: any[] = [];

  constructor(private notificationService: NotificationService,
              private dialog: MatDialog,
              private communService: CommunService,
              private serverService: ServerService) {
  }

  async ngOnInit() {
    this.fieldsForSearch = [
      {name: 'ID', tag: 'id', type: 'in', level: 1},
      {name: 'Date', tag: 'datesms', type: 'contains', level: 2},
      {name: 'SMS', tag: 'contenusms', type: 'contains', level: 3},
      {name: 'Téléphone', tag: 'telclt', type: 'contains', level: 4},
      {name: 'Id Client', tag: 'idclt', type: 'in', level: 5},
    ];

    this.getNotifications(this.currentPage);
  }

  getNotifications(page, filtres = [], exporter = false) {
    this.filtres = filtres;
    this.currentPage = page;
    this.entities = [];

    if (page == null) {
      this.itemsPerPage = null;
    }

    this.notificationService.findAll(this.currentPage, this.itemsPerPage, filtres).toPromise()
        .then((result) => {
          if (result) {
            this.notifications = result.data;
            this.totalItems = result.totalItems;
            if (this.notifications) {
              for (const item of this.notifications) {
                // tslint:disable-next-line:max-line-length
                this.entities.push({object: item, values: [{type: 'id', 'id': item.id}, item.datesms, item.idclt, item.iduser, item.idcmpg, item.telclt, item.contenusms]});
              }
              if (exporter) {
                this.communService.exporter(this.entities, 'notifications');
              }
            }

            if (exporter || page == null) {
              this.currentPage = 1;
              this.itemsPerPage = 10;
            }
          }
        });

  }

  onDetails(notification: Notification) {
    this.dialog.open(ShowDetailComponent, {
      width: '500px',
      data: {
        title: 'Détail notification',
        details: [
          {libelle: 'Date', valeur: notification.datesms},
          {libelle: 'Id Client', valeur: notification.idclt},
          {libelle: 'Id User', valeur: notification.iduser},
          {libelle: 'Id Campagne', valeur: notification.idcmpg},
          {libelle: 'Téléphone', valeur: notification.telclt},
          {libelle: 'SMS', valeur: notification.contenusms},
        ]
      }
    });
  }

  onEdit(notification: Notification) {
    this.selectedNotification = notification;

    this.openEditDialog();
  }

  openEditDialog() {
    let tag;
    let title;

    if (this.selectedNotification == null) {
      tag = 'add';
      title = 'Ajouter notification';
      this.selectedNotification = new Notification();
    } else {
      tag = 'edit';
      title = 'Modifier notification';
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = {
      title,
      entity: this.selectedNotification,
      fields: [
        {label: 'Date', tag: 'datesms', type: 'text', valeur: this.selectedNotification.datesms, required: true},
        {label: 'Id client', tag: 'idclt', type: 'text', valeur: this.selectedNotification.idclt, required: true},
        {label: 'Id user ', tag: 'iduser', type: 'text', valeur: this.selectedNotification.iduser, required: true},
        {label: 'Id campagne ', tag: 'idcmpg', type: 'text', valeur: this.selectedNotification.idcmpg, required: true},
        {label: 'SMS', tag: 'contenusms', type: 'text', valeur: this.selectedNotification.contenusms, required: true},
        {label: 'Mois', tag: 'mois', type: 'text', valeur: this.selectedNotification.mois, required: true},
      ],
      validate: (entity: Notification) => {
        console.log('___ to edit ___');
        console.log(entity);

        this.selectedNotification.datesms    = entity.datesms;
        this.selectedNotification.idclt      = entity.idclt;
        this.selectedNotification.iduser     = entity.iduser;
        this.selectedNotification.idcmpg     = entity.idcmpg;
        this.selectedNotification.contenusms = entity.contenusms;
        this.selectedNotification.mois       = entity.mois;

        if (tag === 'edit') {
          return this.notificationService.edit(this.selectedNotification).toPromise()
              .then(
                  (org) => {
                    console.log('____ Notification edited ___');
                    console.log(org);
                    return org;
                  },
                  (error) => {
                    console.log('___ Error edit notification ___');
                    console.log(error);
                    return error;
                  }
              );
        } else if (tag === 'add') {
          return this.notificationService.add(this.selectedNotification).toPromise()
              .then(
                  (org) => {
                    console.log('____ Notification added ___');
                    console.log(org);
                    return org;
                  },
                  (error) => {
                    console.log('___ Error add notification ___');
                    console.log(error);
                    return error;
                  }
              );
        }
      }
    };

    this.dialog.open(EditEntityComponent, dialogConfig)
        .afterClosed().subscribe((result) => {
      console.log('____ Edit and close dialog notification ___');
      console.log(result);
      if (result && result.submit) {
        this.getNotifications(this.currentPage);
      }
    });
  }

  onDelete(notification: Notification) {
    this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        message: 'Vous allez supprimer cette notification?',
        fields: [
          {label: 'Id client', valeur: notification.idclt},
          {label: 'Id user', valeur: notification.iduser},
          {label: 'Id campagne', valeur: notification.idcmpg},
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        this.notificationService.delete(notification)
            .subscribe(
                (resp) => {
                  console.log('___ Notification deleted ___');
                  console.log(resp);

                  this.getNotifications(this.currentPage);
                }
            );
      }
    });
  }

    exporter(filtres: any[]) {
        this.getNotifications(null, filtres, true);
    }
}
