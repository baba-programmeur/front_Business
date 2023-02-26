import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Mouvement} from '../../../../_model/mouvement';
import {Souscription} from '../../../../_model/souscription';
import {SouscriptionService} from '../../../../_service/autre/souscription.service';
import {MouvementService} from '../../../../_service/autre/mouvement.service';

@Component({
  selector: 'app-correct-mouvement',
  templateUrl: './correct-mouvement.component.html',
  styleUrls: ['./correct-mouvement.component.scss']
})
export class CorrectMouvementComponent implements OnInit {
  formGroup: FormGroup;
  mouvement: Mouvement;
  souscription: any;
  mouvements: Mouvement[];

  constructor(public dialogRef: MatDialogRef<CorrectMouvementComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mouvementService: MouvementService,
              private souscriptionService: SouscriptionService) {
    if (data) {
      this.mouvement = data.mouvement;
    }

    this.formGroup = new FormGroup({
      reference: new FormControl('', []),
      partenaire: new FormControl('', []),
      codePartenaire: new FormControl('', []),
      dateMouvement: new FormControl('', []),
      type: new FormControl('', []),
      montant: new FormControl('', []),
      nouveauMontant: new FormControl('', Validators.required),
    })
  }

  ngOnInit() {
    if (this.mouvement) {
      this.findSouscription(this.mouvement.souscriptionId);
    }
  }

  findSouscription(souscriptionId) {
    this.souscriptionService.findById(souscriptionId).subscribe(
        (souscription: Souscription) => {
          if (souscription) {
            this.souscription = souscription;
          }
        }
    );
  }

  onCancel() {
    this.closeDialog({canceled: true});
  }

  onSubmit() {
    const montant = this.formGroup.value.nouveauMontant;
    this.mouvementService.correct(this.mouvement, montant)
        .subscribe(
            (resp) => {
              this.closeDialog({canceled: false});
            }
        );
  }

  closeDialog(val) {
    this.dialogRef.close(val);
  }
}
