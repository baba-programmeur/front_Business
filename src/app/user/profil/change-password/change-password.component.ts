import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../_service/auth/user.service';

declare var swal: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  password: string;
  currentPassword: string;
  passwordConfirm: string;

  constructor(private router: Router, private userService: UserService) {
    this.form = new FormGroup({
      currentPassword: new FormControl('', [Validators.required, Validators.min(8), Validators.max(12)]),
      password: new FormControl('', [Validators.required, Validators.min(8), Validators.max(12)]),
      passwordConfirm: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
  }

  onCancel() {
    this.router.navigate(['/compte/profil/detail']);
  }

  onSubmit() {
    if (this.password !== this.passwordConfirm) {
      swal({
        icon: 'warning',
        text: 'Les mots de passe ne sont pas identiques.'
      });
    } else {
      this.userService.changePassword(this.currentPassword, this.password)
        .subscribe(
          (resp) => {
            swal({
              icon: 'success',
              text: 'Le mot de passe est modifié avec succés'
            });
            this.logout()
          },
          error => {
            console.log('Error change password', error);
            swal({
              icon: 'error',
              text: error.error
            });
          }
        );
    }
  }

  logout() {
    console.log('Je ferme le popup');
    this.router.navigate(['/logout']);
  }
}
