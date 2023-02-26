import { Component, OnInit } from '@angular/core';
import {Formulaire} from '../../../_model/formulaire';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditEntityComponent} from '../../global/edit-entity/edit-entity.component';
import {FormulaireService} from '../../../_service/autre/formulaire.service';
import {Route, Router} from '@angular/router';

@Component({
  selector: 'app-formulaire-add',
  templateUrl: './formulaire-add.component.html',
  styleUrls: ['./formulaire-add.component.scss']
})
export class FormulaireAddComponent implements OnInit {

  constructor(private formulaireService: FormulaireService,
              private dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
    this.addFormulaire();
  }


  addFormulaire() {
    this.openEditDialog();
  }

  openEditDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = {
      title: "Nouveau formulaire",
      entity: new Formulaire(),
      fields: [
        {label: 'Slug', tag: 'slug', type: 'text', valeur: "", required: true},
        {label: 'Description', tag: 'description', type: 'text', valeur: "", required: true}
      ],
      validate: (entity: Formulaire) => {
        return this.formulaireService.add(entity).toPromise()
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
      /*if (result && result.submit) {
        this.router.navigate(['/formulaires/get-all'])
      }*/
      this.router.navigate(['/formulaires/get-all'])
    });
  }
}
