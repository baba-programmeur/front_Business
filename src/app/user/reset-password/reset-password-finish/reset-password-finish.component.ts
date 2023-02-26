import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../_service/auth/user.service';
import {ActivatedRoute, Router} from '@angular/router';

declare var swal;

@Component({
  selector: 'app-reset-password-finish',
  templateUrl: './reset-password-finish.component.html',
  styleUrls: ['./reset-password-finish.component.scss']
})
export class ResetPasswordFinishComponent implements OnInit {
  message: string;
  success: string;
  resetForm: FormGroup;
  key: string;
  password: string;
  passwordConfirm: string;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
    this.resetForm = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      passwordConfirm: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        console.log('Params: ');
        console.log(params);

        if (!params || !params.key) {
          this.router.navigate(['/reset-password/init']);
        } else {
          this.key = params.key;
        }
      }
    );
  }

  onResetFinish() {
    this.message = null;
    this.success = null;

    if (!this.resetForm.valid) {
      console.log('ResetForm is not valid');
      console.log(this.resetForm);
    } else {
      console.log('Password : ', this.password);
      console.log('PasswordConfirm : ', this.passwordConfirm);

      if (this.password !== this.passwordConfirm) {
        this.message = 'Les deux mots de passe ne sont pas identiques.';
      } else {
        this.userService.resetPasswordFinish(this.key, this.password)
          .subscribe(
            (resp) => {
              console.log('Reset password result');
              console.log(resp);

              swal({
                icon: 'success',
                text: 'Le mot de passe est réinitialisé avec succés.'
              }).then(() => {
                this.router.navigate(['/login']);
              })
            });
      }

    }
  }
}
