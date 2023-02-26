import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Canal} from '../../../_model/canal';
// import {JsonEditorComponent, JsonEditorOptions} from 'ang-jsoneditor';
import {Endpoint} from '../../../_model/endpoint';
import {EndpointService} from '../../../_service/autre/endpoint.service';
import {TypeCanal} from '../../../_model/type-canal';
import {ConfirmDeleteComponent} from '../../global/confirm-delete/confirm-delete.component';
import {Plafond} from '../../../_model/plafond';
import {Configuration} from '../../../_model/configuration';
import {PlafondService} from '../../../_service/autre/plafond.service';

@Component({
  selector: 'app-canal-endpoint',
  templateUrl: './configuration-endpoint.component.html',
  styleUrls: ['./configuration-endpoint.component.scss']
})
export class ConfigurationEndpointComponent implements OnInit {
  formGroup: FormGroup;
  configuration: Configuration;
  selectedEndPoint: Plafond = new Plafond();

  add = false;
  endpoints: Plafond[];

  constructor(public dialogRef: MatDialogRef<ConfigurationEndpointComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog,
              private plafondService: PlafondService) {
    if (data) {
      this.configuration = data.configuration;
    }

    this.formGroup = new FormGroup({
      urlAjoutPartenaire: new FormControl(this.selectedEndPoint.urlAjoutPartenaire, Validators.required),
      urlBlocage: new FormControl(this.selectedEndPoint.urlBlocage, Validators.required),
      urlConsultation: new FormControl(this.selectedEndPoint.urlConsultation, Validators.required),
      urlCredit: new FormControl(this.selectedEndPoint.urlCredit, Validators.required),
      urlDebit: new FormControl(this.selectedEndPoint.urlDebit, Validators.required),
      urlToken: new FormControl(this.selectedEndPoint.urlToken, Validators.required),
      username: new FormControl(this.selectedEndPoint.username, Validators.required),
      password: new FormControl(this.selectedEndPoint.password, Validators.required),
    });
  }

  ngOnInit() {
    if (this.configuration) {
      this.getEnpoints(this.configuration.id);
    }
  }

  getEnpoints(configurationId) {
    return this.plafondService.findAllByConfiguration(configurationId)
        .subscribe(
            (endpoints: any[]) => {
              // tslint:disable-next-line:triple-equals
              if (endpoints && endpoints.length != 0) {
                this.endpoints = endpoints;
                this.selectedEndPoint = this.endpoints[0];
              }
            }
        );
  }

  onSelectEndpoint(event) {
    console.log('___ selected endpoint');
    console.log(event);

    if (event) {
      if (this.endpoints) {
        for (const endpoint of this.endpoints) {
          if (endpoint.configurationId === event) {
            this.selectedEndPoint = endpoint;
          }
        }
      }
    }

  }

  onAdd() {
    this.add = true;
    this.selectedEndPoint = new Plafond();
  }

  onCancelAdd() {
    this.add = false;
    if (this.configuration) {
      this.getEnpoints(this.configuration.id);
    }
  }

  onCancel() {
    this.dialogRef.close('canceled');
  }

  onSubmit() {
    const data = this.formGroup.value;

    if (data) {
      const plafond = new Plafond();
      plafond.urlAjoutPartenaire     = data.urlAjoutPartenaire;
      plafond.urlBlocage         = data.urlBlocage;
      plafond.urlConsultation      = data.urlConsultation;
      plafond.urlCredit     = data.urlCredit;
      plafond.urlDebit  = data.urlDebit;
      plafond.urlToken = data.urlToken;
      plafond.username = data.username;
      plafond.password = data.password;
      plafond.configurationId = this.configuration.id;

      console.log('____ endpoint to add');
      console.log(plafond);

      if (this.add) {
        this.plafondService.add(plafond)
            .subscribe(
                (resp) => {
                  this.dialogRef.close();

                  console.log('__ Plafond config added');
                  this.add = false;
                  if (this.configuration) {
                    this.getEnpoints(this.configuration.id);
                  }
                }
            );
      } else {
        plafond.id = this.selectedEndPoint.id;
        this.plafondService.edit(plafond)
            .subscribe(
                (resp) => {
                  this.dialogRef.close();

                  console.log('__ Endpoint edited');
                  this.add = false;
                  if (this.configuration) {
                    this.getEnpoints(this.configuration.id);
                  }
                }
            );
      }
    }
  }

  /**
   * Delete endpoint
   *
   * @param plafond
   */
  onDelete(plafond: Plafond) {
    console.log('_____ Delete plafond');
    console.log(plafond);

    this.dialog.open(ConfirmDeleteComponent, {
      data: {
        message: 'Vous allez supprimer cette configuration?',
        fields: [
          {label: 'ID', valeur: plafond.id}
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        this.plafondService.delete(plafond)
            .subscribe(
                (resp) => {
                  this.getEnpoints(this.configuration.id);
                }
            );
      }
    });
  }
}
