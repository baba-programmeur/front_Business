import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Formulaire} from '../../../_model/formulaire';
import {EditEntityComponent} from '../../global/edit-entity/edit-entity.component';
import {TypeCanalService} from '../../../_service/autre/type-canal.service';
import {TypeCanal} from '../../../_model/type-canal';

@Component({
  selector: 'app-type-canal-reception-add',
  templateUrl: './type-canal-reception-add.component.html',
  styleUrls: ['./type-canal-reception-add.component.scss']
})
export class TypeCanalReceptionAddComponent implements OnInit {

  constructor(private typeCanalService: TypeCanalService,
              private dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
    this.addTypeCanal();
  }


  addTypeCanal() {
    this.openEditDialog();
  }

  openEditDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = {
      title: 'Ajouter type canal',
      entity: new TypeCanal(),
      fields: [
        {label: 'Libellé', tag: 'libelle', type: 'text', valeur: '', required: true},
        {label: 'Actif', tag: 'actif', type: 'select', valeur: '', required: true, options: [{label: 'OUI', value: 1}, {label: 'NON', value: 0}], onChange: () => {}},
      ],
      validate: (entity: TypeCanal) => {
          return this.typeCanalService.addPlus(entity).toPromise()
              .then(
                  (org) => {
                    return org;
                  });
      }
    };

    this.dialog.open(EditEntityComponent, dialogConfig)
        .afterClosed().subscribe((result) => {
      this.router.navigate(['/type-canals/get-all'])
    });
  }

}
