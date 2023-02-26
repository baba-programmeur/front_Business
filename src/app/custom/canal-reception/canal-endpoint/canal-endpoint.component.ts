import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Canal} from '../../../_model/canal';
// import {JsonEditorComponent, JsonEditorOptions} from 'ang-jsoneditor';
import {Endpoint} from '../../../_model/endpoint';
import {EndpointService} from '../../../_service/autre/endpoint.service';
import {TypeCanal} from '../../../_model/type-canal';
import {ConfirmDeleteComponent} from '../../global/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-canal-endpoint',
  templateUrl: './canal-endpoint.component.html',
  styleUrls: ['./canal-endpoint.component.scss']
})
export class CanalEndpointComponent implements OnInit {
  formGroup: FormGroup;
  canal: Canal;
  selectedEndPoint: Endpoint = new Endpoint();

  add = false;
  endpoints: Endpoint[];

  // public editorOptions: JsonEditorOptions;
  // public body: any;
  // public headers: any;
  // public response: any;

  // @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

  constructor(public dialogRef: MatDialogRef<CanalEndpointComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog,
              private endpointService: EndpointService) {
    if (data) {
      this.canal = data.canal;
    }

    this.formGroup = new FormGroup({
      libelle: new FormControl(this.selectedEndPoint.libelle, [Validators.required]),
      url: new FormControl(this.selectedEndPoint.url, Validators.required),
      method: new FormControl(this.selectedEndPoint.method, Validators.required),
      headers: new FormControl(this.selectedEndPoint.codeKey, []),
      body: new FormControl(this.selectedEndPoint.codeKey, []),
      response: new FormControl(this.selectedEndPoint.codeKey, []),
      codeKey: new FormControl(this.selectedEndPoint.codeKey, []),
      urlToken: new FormControl(this.selectedEndPoint.urlToken, []),
      username: new FormControl(this.selectedEndPoint.username, []),
      password: new FormControl(this.selectedEndPoint.password, []),
      messageKey: new FormControl(this.selectedEndPoint.messageKey, []),
      successCode: new FormControl(this.selectedEndPoint.successCode, [])
    });
    /*
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code'; //set only one mode
    this.editorOptions.mainMenuBar = false;
    */
  }

  ngOnInit() {
    if (this.canal) {
      this.getEnpoints(this.canal.id);
    }
  }

  getEnpoints(canalId) {
    return this.endpointService.findAllByCanal(canalId)
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
          if (endpoint.libelle === event) {
            this.selectedEndPoint = endpoint;
          }
        }
      }
    }

  }

  onAdd() {
    this.add = true;
    this.selectedEndPoint = new Endpoint();
    // this.headers = {};
    // this.body = {};
    // this.response = {};
  }

  onCancelAdd() {
    this.add = false;
    if (this.canal) {
      this.getEnpoints(this.canal.id);
    }
  }

  onCancel() {
    this.dialogRef.close('canceled');
  }

  onSubmit() {
    const data = this.formGroup.value;

    if (data) {
      const endpoint = new Endpoint();
      endpoint.libelle     = data.libelle;
      endpoint.url         = data.url;
      endpoint.method      = data.method;
      endpoint.codeKey     = data.codeKey;
      endpoint.messageKey  = data.messageKey;
      endpoint.successCode = data.successCode;
      endpoint.urlToken = data.urlToken;
      endpoint.username = data.username;
      endpoint.password = data.password;
      endpoint.headers = (data.headers) ? data.headers.replace('\u21b5', '') : '{}';
      endpoint.body    = (data.body) ? data.body.replace('\u21b5', '') : '{}';
      endpoint.reponse = (data.response) ? data.response.replace('\u21b5', '') : '{}';

      endpoint.canalId = this.canal.id;

      console.log('____ endpoint to add');
      console.log(endpoint);

      if (this.add) {
        this.endpointService.add(endpoint)
            .subscribe(
                (resp) => {
                  this.dialogRef.close();

                  console.log('__ Endpoint added');
                  this.add = false;
                  if (this.canal) {
                    this.getEnpoints(this.canal.id);
                  }
                }
            );
      } else {
        endpoint.id = this.selectedEndPoint.id;
        this.endpointService.edit(endpoint)
            .subscribe(
                (resp) => {
                  this.dialogRef.close();

                  console.log('__ Endpoint edited');
                  this.add = false;
                  if (this.canal) {
                    this.getEnpoints(this.canal.id);
                  }
                }
            );
      }
    }
  }

  /**
   * Delete endpoint
   *
   * @param endpoint
   */
  onDelete(endpoint: Endpoint) {
    console.log('_____ Delete endpoint');
    console.log(endpoint);

    this.dialog.open(ConfirmDeleteComponent, {
      data: {
        message: 'Vous allez supprimer ce endpoint?',
        fields: [
          {label: 'Libellé', valeur: endpoint.libelle}
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        this.endpointService.delete(endpoint)
            .subscribe(
                (resp) => {
                  this.getEnpoints(this.canal.id);
                }
            );
      }
    });
  }
}
