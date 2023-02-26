import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../_service/auth/user.service';

declare var swal;

@Component({
  selector: 'app-reset-password-init',
  templateUrl: './reset-password-init.component.html',
  styleUrls: ['./reset-password-init.component.scss']
})
export class ResetPasswordInitComponent implements OnInit {
  message: string;
  success: string;
  resetForm: FormGroup;
  email: string;

  constructor(private userService: UserService,
              private router: Router) {
    this.resetForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  ngOnInit() {
  }

  onReset() {
    this.message = null;
    this.success = null;

    if (!this.resetForm.valid) {
      console.log('ResetForm is not valid');
      console.log(this.resetForm);
    } else {
      console.log('Email : ', this.email);

      this.userService.resetPasswordInit(this.email)
        .subscribe(
          (resp) => {
            console.log('Reset password result');
            console.log(resp);
            swal({
              icon: 'success',
              text: 'Le lien de réinitialisation est envoyé à votre adresse mail'
            }).then(() => {
              this.router.navigate(['/login']);
            });
          });
    }
  }

}
