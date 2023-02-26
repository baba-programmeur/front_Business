import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-authorisation-user',
  templateUrl: './authorisation-user.component.html',
  styleUrls: ['./authorisation-user.component.scss', '../confirm-delete/confirm-delete.component.scss' ]
})
export class AuthorisationUserComponent implements OnInit {

  fields: any[];
  authorisations: any[];
  tabAuthorisations: any[];
  userId: number;
  title: string;

  constructor(public dialogRef: MatDialogRef<AuthorisationUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.userId = data.user;
    this.authorisations = data.authorisations;
    this.fields  = data.fields;
    this.tabAuthorisations = [];
    this.initTabAuthorisation();
  }

  ngOnInit() {
  }

  closeDialog(value) {
    value.tab = this.tabAuthorisations;
    this.dialogRef.close(value);
  }

  initTabAuthorisation() {
    this.authorisations.forEach(value => {
      if (value.users.findIndex(e => e.id === this.userId) !== -1) {
        this.addAuthorisation(value);
      }
    })
  }

  isActiveAuthorisation(authorisation: any) {
    return authorisation.users.findIndex(e => e.id === this.userId) !== -1;
  }

  addAuthorisation(authorisation: any) {
    console.log('========================== Id: ', authorisation);
    if (this.tabAuthorisations.findIndex(e => e.id === authorisation.id) === -1) {
      console.log('add');
      this.tabAuthorisations.push(authorisation);
    } else {
      console.log('remove');
      this.tabAuthorisations.splice(this.tabAuthorisations.findIndex(e => e.id === authorisation.id), 1);
    }
    console.log('---------------======================== Tableau authorisations: ', this.tabAuthorisations);
  }
}
