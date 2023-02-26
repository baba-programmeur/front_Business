import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {
  fields: any[];
  message: string;
  title: string;
  cancelBtn = 'Annuler';
  confirmBtn = 'Confirmer';

  constructor(public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message;
    if (data.title) {
      this.title = data.title;
    } else {
      this.title = 'Suppression';
    }
    if (data.cancelBtn) {
      this.cancelBtn = data.cancelBtn;
    }
    if (data.confirmBtn) {
      this.confirmBtn = data.confirmBtn;
    }
    this.fields  = data.fields;
  }

  ngOnInit() {
  }

  closeDialog(value) {
    this.dialogRef.close(value);
  }
}
