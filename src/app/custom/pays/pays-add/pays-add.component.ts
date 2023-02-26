import { Component, OnInit } from '@angular/core';
import {Pays} from '../../../_model/pays';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditEntityComponent} from '../../global/edit-entity/edit-entity.component';
import {PaysService} from '../../../_service/autre/pays.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pays-add',
  templateUrl: './pays-add.component.html',
  styleUrls: ['./pays-add.component.scss']
})
export class PaysAddComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private router: Router,
              private paysService: PaysService) { }

  ngOnInit() {
    this.openEditDialog();
  }

  openEditDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      title: "Nouveau pays",
      entity: {},
      fields: [
        {label: 'Nom', tag: 'name', type: 'text', valeur: '', required: true},
        {label: 'Code iso2', tag: 'alpha2', type: 'text', valeur: '', required: true},
        {label: 'Code iso3', tag: 'alpha3', type: 'text', valeur: '', required: true},
        {label: 'Indicatif', tag: 'indicatif', type: 'number', valeur: '', required: true},
      ],
      validate: (entity: Pays) => {
        return this.paysService.add(entity, false).toPromise()
            .then(
                (org) => {
                  return org;
                },
                (error) => {
                  return error;
                }
            );
      }
    };

    this.dialog.open(EditEntityComponent, dialogConfig)
        .afterClosed().subscribe((result) => {
      if (result && result.submit) {
        this.router.navigate(['/pays/get-all']);
      } else {
        this.router.navigate(['/pays/get-all']);
      }
    });
  }

}
