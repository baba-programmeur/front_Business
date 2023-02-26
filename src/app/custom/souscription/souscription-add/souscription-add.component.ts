import { Component, OnInit } from '@angular/core';
import {FormulaireService} from '../../../_service/autre/formulaire.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditEntityComponent} from '../../global/edit-entity/edit-entity.component';
import {Souscription} from '../../../_model/souscription';
import {Router} from '@angular/router';
import {SouscriptionService} from '../../../_service/autre/souscription.service';

@Component({
  selector: 'app-souscription-add',
  templateUrl: './souscription-add.component.html',
  styleUrls: ['./souscription-add.component.scss']
})
export class SouscriptionAddComponent implements OnInit {

  constructor(private formulaireService: FormulaireService,
              private souscriptionService: SouscriptionService,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.addSouscription();
  }

  addSouscription() {
    // find formulaire
    this.formulaireService.findByTag('souscription')
        .subscribe(
            champs => {
              console.log("Formulaire");
              console.log(champs);

              this.addDialog(champs);
            }
        );
  }

  addDialog(champs) {
    let fields = [];

    for (let item of champs) {
      fields.push({label: item.label, tag: item.slug, type: item.type, valeur: '', required: false, options: JSON.parse(item.optionsValue)});
    }

    console.log('___ fields');
    console.log(fields);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      title: 'Nouvelle souscription',
      entity: {},
      fields: fields,
      validate: (entity: any) => {
        console.log('souscription added !!');
        console.log(entity);
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
    };

    this.dialog.open(EditEntityComponent, dialogConfig)
        .afterClosed().subscribe(val => {
          if (val) {
            console.log(val);
              this.router.navigate(['/souscriptions/get-all']);
          }
    });
  }

}
