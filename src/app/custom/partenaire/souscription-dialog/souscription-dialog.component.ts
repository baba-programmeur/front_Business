import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../../_service/auth/user.service';
import {AuthService} from '../../../_service/auth/auth.service';
import {Pays} from '../../../_model/pays';
import {SouscriptionService} from '../../../_service/autre/souscription.service';

@Component({
  selector: 'app-souscription-dialog',
  templateUrl: './souscription-dialog.component.html',
  styleUrls: ['./souscription-dialog.component.scss']
})
export class SouscriptionDialogComponent implements OnInit {
  message = '';
  public profil: string;
  public allPays: Pays[];
  public account: any;
  public formulaire = [];

  globalForm: FormGroup = new FormGroup({});
  constructor(
      public dialogRef: MatDialogRef<SouscriptionDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private authService: AuthService,
      private fb: FormBuilder,
      public dialog: MatDialog,
      public userService: UserService,
      private souscriptionService: SouscriptionService
  ) {
  }

  ngOnInit() {
    this.profil = '';
    this.account = this.userService.getUserInfo();
    console.log('------------------- Data recu : ', this.data);
    /*
    if (!this.data || !this.data.userId) {
      alert('Utilisateur non recu');
    }
    */
  }

  onSubmit() {
    console.log('_____ form value');
    console.log(this.globalForm.value);

    const donnees: any = this.globalForm.value;
    if (this.data && this.data.userId) {
      donnees.iduser = this.data.userId
    }
    console.log('------------------------ les données à envoyés : --------------------------------');
    console.log(donnees);
    return this.souscriptionService.addFormulaireData(donnees, 'souscription').toPromise()
        .then(
            (org) => {
              this.dialogRef.close({submit: true});
            }
        );
  }

  onCancel() {
    if (this.data && this.data.userId) {
      this.dialog.closeAll();
    } else {
      this.authService.logout();
    }
  }

  onFormChange(form) {
    this.globalForm = form;
  }
}
