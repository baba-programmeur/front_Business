import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../../_service/auth/user.service';
import {AuthService} from '../../../_service/auth/auth.service';
import {Pays} from '../../../_model/pays';
import {PaysService} from '../../../_service/autre/pays.service';
import {FormulaireData} from '../../../_model/formulaire-data';
import {FormulaireItemData} from '../../../_model/formulaire-item-data';
import {SouscriptionService} from '../../../_service/autre/souscription.service';

@Component({
  selector: 'app-souscription-dialog',
  templateUrl: './souscription-active.component.html',
  styleUrls: ['./souscription-active.component.scss']
})
export class SouscriptionActiveComponent implements OnInit {
  message = '';
  public profil: string;
  public allPays: Pays[];
  public account: any;
  public formulaire = [];

  globalForm: FormGroup = new FormGroup({});
  constructor(
      public dialogRef: MatDialogRef<SouscriptionActiveComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private authService: AuthService,
      public dialog: MatDialog
  ) {

  }

  ngOnInit() {
  }

  onCancel() {
    this.authService.logout();
  }
}
