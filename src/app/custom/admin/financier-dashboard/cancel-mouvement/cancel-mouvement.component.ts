import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Souscription} from '../../../../_model/souscription';
import {Mouvement} from '../../../../_model/mouvement';

@Component({
  selector: 'app-cancel-mouvement',
  templateUrl: './cancel-mouvement.component.html',
  styleUrls: ['./cancel-mouvement.component.scss']
})
export class CancelMouvementComponent implements OnInit {
  mouvement: Mouvement;
  codePartenaire: string;
  partenaire: string;
  montant: string;

  constructor(public dialogRef: MatDialogRef<CancelMouvementComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.mouvement = data.mouvement;
      this.codePartenaire = data.codePartenaire;
      this.partenaire     = data.partenaire;
      this.montant = this.mouvement.montant.toLocaleString('fr-FR');
    }
  }

  ngOnInit() {
  }

  closeDialog(value) {
    this.dialogRef.close(value);
  }
}
