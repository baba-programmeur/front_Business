import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../_service/auth/user.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {User} from '../../../_model/user';

declare var swal: any;

@Component({
  selector: 'app-profil-edit',
  templateUrl: './profil-edit.component.html',
  styleUrls: ['./profil-edit.component.scss']
})
export class ProfilEditComponent implements OnInit {
  message: string;
  success: string;
  login: any;
  prenom: any;
  nom: any;
  adresse: any;
  email: any;
  telephone: any;
  editForm: FormGroup;
  user: User;

  constructor(public dialogRef: MatDialogRef<ProfilEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) {
    this.editForm = new FormGroup({
      prenom: new FormControl('', [Validators.required]),
      nom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit() {
    this.user = this.data.user;
  }

  onSubmit() {
    this.message = null;

    if (!this.editForm.valid) {
      console.log('Edit form is not valid !!!!');
    } else {
      this.userService.updateProfil(this.user)
        .subscribe(
          (resp) => {
            console.log('Profil updated');
            console.log(resp);

            swal({
              icon: 'success',
              text: 'Profil modifié avec succés !!!',
            }).then(() => {
              this.dialogRef.close({canceled: false});

             // this.router.navigate(['/compte/profil/detail']);
            });
          },
          error => {
            console.log('Error update profil', error);

            if (error.status === 200 || error.status === 201) {
              this.success = error.error.text;
            } else {
              this.message = error.error;
            }

            swal({
              icon: 'error',
              text: this.message,
            });
          }
        );
    }
  }

  onCancel() {
    this.dialogRef.close({canceled: true});
  }
}
