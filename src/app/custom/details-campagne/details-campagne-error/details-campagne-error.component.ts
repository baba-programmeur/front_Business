import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DetailCampagne} from '../../../_model/detail-campagne';

@Component({
  selector: 'app-details-campagne-error',
  templateUrl: './details-campagne-error.component.html',
  styleUrls: ['./details-campagne-error.component.scss']
})
export class DetailsCampagneErrorComponent implements OnInit {
  detail: DetailCampagne;
  message: string;
  champ: string;

  constructor(public dialogRef: MatDialogRef<DetailsCampagneErrorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.detail = data.detail;
      this.message = data.message;
      this.champ = data.champ;
    }
  }

  ngOnInit() {
  }

  closeDialog(value) {
    this.dialogRef.close(value);
  }

}
