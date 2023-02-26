import {Component, Inject, OnInit} from '@angular/core';
import {CanalService} from '../../_service/autre/canal.service';
import {TypeCanal} from '../../_model/type-canal';
import {Canal} from '../../_model/canal';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CampagneService} from '../../_service/autre/campagne.service';
import {CampagneIndiv} from '../../_model/campagne-indiv';
import {UserService} from '../../_service/auth/user.service';
import {CampagnePartenaire} from '../../_model/campagne-partenaire';
import {DetailPartenaire} from '../../_model/detail-partenaire';
import {Compte} from '../../_model/compte';
import {FormulaireData} from '../../_model/formulaire-data';

@Component({
  selector: 'app-paiement-individuel',
  templateUrl: './paiement-individuel.component.html',
  styleUrls: ['./paiement-individuel.component.scss']
})
export class PaiementIndividuelComponent implements OnInit {

  typeCanals: TypeCanal[];
  typeCanalLibelle: string;
  canals: Canal[];
  typeCanalId: number;
  campagneForm: FormGroup;
  typeCampagne = 'DECAISSEMENT';
  canalLibelle: string;
  nomCampagne: string;
  constructor(
      private canalService: CanalService,
      private _formBuilder: FormBuilder,
      private campagneService: CampagneService,
      private dialog: MatDialog,
      private dialogRef: MatDialogRef<PaiementIndividuelComponent>,
      private userService: UserService,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.typeCanal === 'DECAISSEMENT') {
      this.campagneForm = _formBuilder.group({
        nomCampagneCtrl: ['', Validators.required],
        canalCtrl: ['', []],
        typeCanalCtrl: ['', []],
        idClient: new FormControl('', Validators.required),
        prenom: new FormControl('', Validators.required),
        nom: new FormControl('', Validators.required),
        mail: new FormControl('', []),
        telephone: new FormControl('', Validators.required),
        montant: new FormControl('', Validators.required),
        typePiece: new FormControl('', Validators.required),
        numeroPiece: new FormControl('', Validators.required),
        motif: new FormControl('', Validators.required),
        commentaire: new FormControl('', [])
      })
    } else {
      this.campagneForm = _formBuilder.group({
        nomCampagneCtrl: ['', Validators.required],
        numeroFacture: ['', Validators.required],
        echeance: ['', Validators.required],
        idClient: new FormControl('', Validators.required),
        prenom: new FormControl('', Validators.required),
        nom: new FormControl('', Validators.required),
        mail: new FormControl('', []),
        montant: new FormControl('', Validators.required),
        telephone: new FormControl('', Validators.required),
        motif: new FormControl('', Validators.required),
        commentaire: new FormControl('', [])
      })
    }
  }

  ngOnInit() {
    this.getTypeCanals();
    this.typeCampagne = this.data.typeCanal;
  }

  getTypeCanals() {
    this.canalService.getTypeCanals()
        .subscribe(
            (typeCanals: TypeCanal[]) => {
              this.typeCanals = typeCanals;
            }
        );
  }

  getCanals(typeCanalId, codePays) {
    if (this.typeCanals) {
      for (const type of this.typeCanals) {
        if (type.id == typeCanalId) {
          this.typeCanalLibelle = type.libelle;
        }
      }
    }

    console.log('______ type canal libelle', this.typeCanalLibelle);

    if (this.typeCanalLibelle == 'banque') {
      this.campagneForm.addControl('banque', new FormControl('', Validators.required));
      this.campagneForm.addControl('numeroCompte', new FormControl('', Validators.required))
    }

    this.canalService.getCanalsEntite(typeCanalId, codePays)
        .subscribe(
            (canals: any) => {
              this.canals = canals;
            }
        );
  }

  onSelectTypeCanal() {
    let account: Compte = this.userService.getUserInfo();

    console.log('_____ selected type canal ____');
    console.log(account);
    console.log(this.typeCanalId);
    console.log(this.typeCanalLibelle);

    if (this.typeCanalId) {
      this.getCanals(this.typeCanalId, account.pays.alpha3);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  validerCampagne() {
    const campagneIndiv = new CampagnePartenaire();
    campagneIndiv.notification = true;

    // campagneIndiv.detail = new DetailCampagne();
    let detailPartenaire = new FormulaireData();

    // Set Value to Object campagneIndiv
    campagneIndiv.nomCampagne        = this.nomCampagne;
    // campagneIndiv.typeCampagne       = this.typeCampagne;
    //
    // detailPartenaire.idClient    = this.campagneForm.controls.idClient.value;
    // detailPartenaire.telephone   = this.campagneForm.controls.telephone.value;
    // detailPartenaire.prenom      = this.campagneForm.controls.prenom.value;
    // detailPartenaire.nom         = this.campagneForm.controls.nom.value;
    // detailPartenaire.mail        = this.campagneForm.controls.mail.value;
    // detailPartenaire.montant     = this.campagneForm.controls.montant.value;
    // detailPartenaire.motif       = this.campagneForm.controls.motif.value;
    // detailPartenaire.commentaire = this.campagneForm.controls.commentaire.value;

    if (this.typeCampagne === "DECAISSEMENT") {
      // detailPartenaire.canal       = this.canalLibelle;
      // detailPartenaire.typeCanal   = this.typeCanalLibelle;
      // detailPartenaire.typePiece   = this.campagneForm.controls.typePiece.value;
      // detailPartenaire.numeroPiece = this.campagneForm.controls.numeroPiece.value;
      if (this.typeCanalLibelle == 'banque') {
        // detailPartenaire.banque = this.campagneForm.controls.banque.value;
        // detailPartenaire.numeroCompte = this.campagneForm.controls.numeroCompte.value;
      }
    } else {
      // detailPartenaire.numFacture  = this.campagneForm.controls.numeroFacture.value;
      // detailPartenaire.echeance    = this.campagneForm.controls.echeance.value;
    }

    // campagneIndiv.montantTotal = detailPartenaire.montant;
    campagneIndiv.details = [detailPartenaire];
    
    console.log(campagneIndiv);

    this.campagneService.add(campagneIndiv, this.typeCampagne)
        .subscribe(
            (campagneIndividuelle: CampagneIndiv) => {
              // TODO: Mettre une notification ici
              console.log('La reponse recue: ', campagneIndividuelle);
              this.dialogRef.close(campagneIndividuelle);
            },
            error => {
              console.log(error);
            }
        )
  }

}
