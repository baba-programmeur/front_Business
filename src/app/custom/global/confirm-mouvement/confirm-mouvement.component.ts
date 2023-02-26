import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Souscription} from '../../../_model/souscription';
import {Mouvement} from '../../../_model/mouvement';

@Component({
  selector: 'app-confirm-mouvement',
  templateUrl: './confirm-mouvement.component.html',
  styleUrls: ['./confirm-mouvement.component.scss']
})
export class ConfirmMouvementComponent implements OnInit {
  souscription: any;
  mouvement: Mouvement;

  constructor(public dialogRef: MatDialogRef<ConfirmMouvementComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.souscription = data.souscription;
      this.souscription.nomes = this.souscription.raison_sociale ? this.souscription.raison_sociale : this.souscription.prenom + ' ' + this.souscription.nom;
      this.mouvement    = data.mouvement;
    }
  }

  ngOnInit() {
  }

  closeDialog(val) {
    this.dialogRef.close(val);
  }
}
