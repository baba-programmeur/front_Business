import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DetailCampagne} from '../../../_model/detail-campagne';
import {DetailCampagneError} from '../../../_model/detail-campagne-error';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FileService} from '../../../_service/autre/file.service';
import * as XLSX from 'xlsx';
import {LoaderService} from '../../../_service/auth/loader.service';

@Component({
  selector: 'app-add-detail-campagne',
  templateUrl: './add-detail-campagne.component.html',
  styleUrls: ['./add-detail-campagne.component.scss']
})
export class AddDetailCampagneComponent implements OnInit {
  detailCampagne: any;
  typeCampagne: string;
  error: DetailCampagneError;
  ligne: number;
  nbErrors: number;
  detailForm: FormGroup;
  detailError: DetailCampagneError;
  header: string[] = [];

  listErreurs = [];
  erreurs = [];
  file: File;

  constructor(
      formBuilder: FormBuilder,
      private loaderService: LoaderService,
      public dialogRef: MatDialogRef<AddDetailCampagneComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('_____ data _______');
    console.log(data);

    this.typeCampagne   = data.typeCampagne;
    this.listErreurs    = data.erreurs;
    this.file           = data.file;
    this.nbErrors       = data.nbErrors;

    for (const err of this.listErreurs) {
      console.log('---------------- ERROR -------------');
      console.log(this.detailsToList(err.erreur.error));
      this.erreurs.push({
        ligne: err.ligne,
        tabError: this.detailsToList(err.erreur.error)
      });
    }

  }

  ngOnInit() {
  }

  detailsToList(details) {
    const data = [];
    const head: string[] = Object.keys(details);
    for (const h of head) {
      data.push(details[h.substring(1, h.length)]);
    }
    console.log('---------- Erreur +++++++++++');
    console.log(details);
    return data;
  }

  onValidate() {
    this.detailError = FileService.validateDetail(this.detailCampagne, this.typeCampagne);

    console.log('____ Error new _____');
    console.log(this.detailError);

    if (FileService.isEmpty(this.detailError)) {
      this.detailError = null;
      this.closeDialog({canceled: false, detail: this.detailCampagne});
    }
  }

  onCancel() {
    this.closeDialog({canceled: true});
  }

  closeDialog(val) {
    this.dialogRef.close(val);
  }

  exportAsExcelFile(): void {
    this.loaderService.show();
    const tabErr = [];
    for (const e of this.erreurs) {
      for (const i of e.tabError) {
        tabErr.push({
          'LIGNE': '#' + e.ligne,
          'ERREURS': i,
          'TYPE' : 'BLOQUANT'
        })
      }
    }
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tabErr);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    setTimeout(() => {
      XLSX.writeFile(workbook,  'ERROR' + this.file.name.split('.')[0] + '.xlsx', {bookType: 'xlsx', type: 'binary'});
      this.loaderService.hide()
    }, 2000);
  }

}
