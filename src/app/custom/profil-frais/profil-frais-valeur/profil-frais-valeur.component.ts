import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PlageService} from '../../../_service/plage.service';
import {formatNumber} from '@angular/common';

@Component({
  selector: 'app-profil-frais-valeur',
  templateUrl: './profil-frais-valeur.component.html',
  styleUrls: ['./profil-frais-valeur.component.scss']
})
export class ProfilFraisValeurComponent implements OnInit {
  plages: any[] = [];
  profilFrais: any;
  message: string;

  constructor(public dialogRef: MatDialogRef<ProfilFraisValeurComponent>,
              private plageService: PlageService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.profilFrais = data.details;

    if (this.profilFrais.type === 'plage') {
      this.getPlages(this.profilFrais.id);
    }
  }

  ngOnInit() {
  }

  getPlages(id) {
    this.plageService.getPlageByFrais(id).toPromise()
        .then(
            (result: any[]) => {
              console.log(result);
              if (result) {
                this.plages = result;
              }
            }
        )
  }

  closeDialog(value) {
    this.dialogRef.close(value);
  }

  formatMontant(montant: any) {
    return formatNumber(montant, 'Fr-fr');
  }
}
