import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-update-mail-list',
  templateUrl: './update-mail-list.component.html',
  styleUrls: ['./update-mail-list.component.scss']
})
export class UpdateMailListComponent implements OnInit {
  valeur: string;

  constructor(public dialogRef: MatDialogRef<UpdateMailListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.valeur = data.valeur;
  }

  ngOnInit() {
  }

  closeDialog(value) {
    value.valeur = this.valeur;
    this.dialogRef.close(value);
  }

}
