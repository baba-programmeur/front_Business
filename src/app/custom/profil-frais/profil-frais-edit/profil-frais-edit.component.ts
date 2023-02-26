import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ProfilFraisService} from '../../../_service/autre/profil-frais.service';
import {ProfilFrais} from '../../../_model/profil-frais';
import {Plage} from '../../../_model/plage';
import {PlageService} from '../../../_service/plage.service';
import {CanalService} from '../../../_service/autre/canal.service';
import {TypeCanal} from '../../../_model/type-canal';
import {Canal} from '../../../_model/canal';
import {FraisDetail} from '../../../_model/frais-detail';
import {ConfirmDeleteComponent} from '../../global/confirm-delete/confirm-delete.component';
import { ProfilFraisPartenaire } from '../../../_model/profil-frais-partenaire';
import {formatNumber} from '@angular/common';

declare var swal;

@Component({
  selector: 'app-profil-frais-edit',
  templateUrl: './profil-frais-edit.component.html',
  styleUrls: ['./profil-frais-edit.component.scss']
})
export class ProfilFraisEditComponent implements OnInit {
  formGroup: FormGroup;
  souscription: any;
  fraisDetail: FraisDetail = new FraisDetail();
  fraisDetails: FraisDetail[];
  fraisDetailsFilter: FraisDetail[] = [];
  plages: Plage[];
  plagesCourant: Plage[] = [];

  min: number;
  max: number;
  montant: number;
  typePlage: string;
  typeCanals: TypeCanal[];
  canals: Canal[];
  selectedTypeCanal: TypeCanal = new TypeCanal();
  selectedCanal: Canal = new Canal();
  canal: string;
  typeCanal: string;
  typeCampagne = 'DECAISSEMENT';

  constructor(public dialogRef: MatDialogRef<ProfilFraisEditComponent>,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private profilFraisService: ProfilFraisService,
              private canalService: CanalService,
              private plageService: PlageService) {
    if (data) {
      this.souscription = data.souscription;
      // tslint:disable-next-line:max-line-length
      this.souscription.nomes = this.souscription.raison_sociale ? this.souscription.raison_sociale : this.souscription.prenom + ' ' + this.souscription.nom;
      console.log('----------');
      console.log(this.souscription);
    }

    this.formGroup = new FormGroup({
      nomPartenaire: new FormControl(this.souscription.nomes, [Validators.required]),
      codePartenaire: new FormControl(this.souscription.code_partenaire, [Validators.required]),
      type: new FormControl('', [Validators.required]),
      valeur: new FormControl('', ),
      typeCanal: new FormControl('', [Validators.required]),
      canal: new FormControl('', [Validators.required]),
      min: new FormControl('', []),
      max: new FormControl('', []),
      montant: new FormControl('', []),
      typePlage: new FormControl('', []),
    })
  }

  ngOnInit() {
    this.getTypeCanals();
    this.getFrais(this.souscription.id);
  }

  getTypeCanals() {
    this.canalService.getTypeCanals().subscribe(
        (typeCanals: any[]) => {
          this.typeCanals = typeCanals;
          if (this.typeCanals && this.typeCanals.length !== 0) {
            this.selectedTypeCanal = this.typeCanals[0];
            this.getCanals(this.selectedTypeCanal);
          }
        }
    )
  }

  getCanals(typeCanal) {
    this.canalService.getCanalsEntite(typeCanal.id, this.souscription.pays)
        .subscribe(
            (canals: any[]) => {
              this.canals = canals;
              if (this.canals && this.canals.length !== 0) {
                this.selectedCanal = this.canals[0];
                this.getFraisByCanal(this.selectedCanal.id);
              }
            }
        );
  }

  getFraisByCanal(canalId) {
    if (this.fraisDetails) {
      for (const fraisDetail of this.fraisDetails) {
        if (fraisDetail.canalId === canalId) {
          this.fraisDetail = fraisDetail;

          if (this.fraisDetail.type === 'plage') { // find plages
            this.getPlages(this.fraisDetail.id);
          }
        }
      }
    }
  }

  getFrais(sousId) {
    this.profilFraisService.getFraisBySouscription(sousId)
        .subscribe(
            (resp: FraisDetail[]) => {
              if (resp) {
                console.log(resp);
                this.fraisDetails = resp;
                this.filtrerFrais();
              }
            }
        );
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  onSubmit() {
    if (this.souscription && this.fraisDetail) {
      switch (this.fraisDetail.type) {
        case 'fixe': this.fraisDetail.libelle = 'Frais fixe'; break;
        case 'pourcentage': this.fraisDetail.libelle = 'Pourcentage'; break;
        case 'plage': this.fraisDetail.libelle = 'Plage'; break;
        default: break;
      }
      // tslint:disable-next-line:max-line-length
      if (this.fraisDetail.libelle === 'Frais fixe' || this.fraisDetail.libelle === 'Pourcentage') {
        if (!this.fraisDetail.valeur) {
          swal({
            icon: 'warning',
            text: 'Merci de renseigner la valeur du frais'
          })
        } else {
          if (this.fraisDetail.type === 'pourcentage' && +this.fraisDetail.valeur > 1) {
            swal({
              icon: 'warning',
              text: 'Merci de renseigner une valeur compris entre 0 et 1'
            })
          } else {
            this.saveProfilFrais();
          }
        }
      } else {
        if (this.plagesCourant.length === 0) {
          swal({
            icon: 'warning',
            text: 'Merci de renseigner au moins une plage'
          })
        } else {
          this.saveProfilFrais();
        }
      }
    }
  }

  filtrerFrais() {
    this.fraisDetailsFilter = this.fraisDetails.filter(x => x.typeOperation === this.typeCampagne);
    // console.log('++--++--++-- : Les profils frais filtrés : ', this.fraisDetailsFilter);
  }

  saveProfilFrais() {
    const profilFrais = new ProfilFrais();
    profilFrais.id = this.fraisDetail.id;
    profilFrais.type = this.fraisDetail.type;
    profilFrais.libelle = this.fraisDetail.libelle;
    profilFrais.valeur = this.fraisDetail.valeur;
    profilFrais.statut = 'A';
    if (this.typeCampagne !== 'ENCAISSEMENT') {
      profilFrais.canalId = this.selectedCanal.id;
      profilFrais.canalLibelle = this.selectedCanal.libelle;
    } else {
      profilFrais.canalId = null;
      profilFrais.canalLibelle = null;
    }
    profilFrais.codePartenaire = this.souscription.code_partenaire;
    profilFrais.souscriptionId = this.souscription.id;
    profilFrais.createdAt = this.fraisDetail.createdAt;
    profilFrais.updatedAt = this.fraisDetail.updatedAt;
    profilFrais.typeOperation = this.typeCampagne;

    const profilFraisPartenaire = new ProfilFraisPartenaire();

    profilFraisPartenaire.plages = this.plagesCourant;
    profilFraisPartenaire.profilFrais = profilFrais;

    console.log(profilFrais);
    this.profilFraisService.editSouscriptionFrais(this.souscription.id, profilFraisPartenaire)
        .subscribe(
            resp => {
              if (resp) {
                swal({
                  icon: 'success',
                  text: 'Frais modifiés avec succés.'
                }).then(() => {
                  this.getTypeCanals();
                  this.getFrais(this.souscription.id);
                })
              }
            }
        );
  }

  onAddPlage() {
    let error = '';
    if (!this.min && this.min !== 0) {
      error = 'Merci de saisir le montant minimum';
    } else if (!this.max) {
      error = 'Merci de saisir le montant maximum';
    } else if (this.max === 0 ) {
      error = 'Merci de saisir un montant maximum valide';
    } else if (!this.montant) {
      error = 'Merci de saisir les frais';
    } else if (this.min >= this.max) {
      error = 'Le minimum ne peut pas étre supérieur au maximum';
    } else if (this.plagesCourant.length !== 0) {
      if (this.min <= this.plagesCourant[this.plagesCourant.length - 1].max) {
        error = 'Le minimum doit étre supérieur au maximum précédent';
      }
    }

    if (error !== '') {
      swal({
        icon: 'warning',
        text: error
      });
    } else {
      console.log('Min = ', this.min);
      console.log('Max = ', this.max);
      console.log('Frais = ', this.montant);
      const plage = new Plage();
      plage.min = this.min;
      plage.max = this.max;
      plage.montant = this.montant;

      this.plagesCourant.push(plage);

      this.min = this.max + 1;
      this.max = 0;
      this.montant = 0;
    }
  }

  onRemovePlage(plage: Plage) {
    this.dialog.open(ConfirmDeleteComponent, {
      width: '350px',
      data: {
        message: 'Vous allez supprimer cette plage ?',
        fields: [
            {label: 'min', valeur: plage.min},
            {label: 'max', valeur: plage.max},
            {label: 'montant', valeur: plage.montant},
            ]
      }
    })
        .afterClosed().subscribe(
        result => {
          if (!result.canceled) {
            const index: number = this.plagesCourant.indexOf(plage);
            console.log('__ _index ', index);
            console.log('__ plage ', plage);
            console.log('__ plages ', this.plagesCourant);

            if (index !== -1) {
              this.plagesCourant.splice(index, 1);
            }
          }
        });
  }

  getPlages(id) {
    this.plageService.getPlageByFrais(id)
        .subscribe(
            (resp: Plage[]) => {
              if (resp) {
                console.log('Les plages : ', this.plages);
                this.plages = resp;
                this.plagesCourant = resp;
              }
            }
        );
  }

  closeDialog(val) {
    this.dialogRef.close(val);
  }

  detailsFrais(frais: FraisDetail) {
    this.fraisDetail = frais;
    if (this.fraisDetail.type === 'plage') {
      this.getPlages(this.fraisDetail.id);
    }
  }

  changeType(encaissement: string) {
    this.typeCampagne = encaissement;
    console.log(this.typeCampagne);
    if (encaissement === 'ENCAISSEMENT') {
      this.formGroup.controls['typeCanal'].clearValidators();
      this.formGroup.controls['canal'].clearValidators();
    } else {
      this.formGroup.controls['typeCanal'].setValidators(Validators.required);
      this.formGroup.controls['canal'].setValidators(Validators.required);
    }
    // TODO : remove constrainte on champ canal and typeCanal
    this.filtrerFrais();
  }

  formatMontant(montant: any) {
    return formatNumber(montant, 'Fr-fr');
  }
}
