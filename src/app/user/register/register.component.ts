import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_service/auth/auth.service';
import {CookieService} from 'ngx-cookie-service';
import {UserService} from '../../_service/auth/user.service';
import {Router} from '@angular/router';

declare var swal;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  message: string;
  success: string;
  registerForm: FormGroup;
  recaptchaStr = '';

  prenom: string;
  nom: string;
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;

  constructor(private authService: AuthService,
              private cookieService: CookieService,
              private router: Router,
              private userService: UserService) {
    this.registerForm = new FormGroup({
      prenom: new FormControl('', [Validators.required]),
      nom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      passwordConfirm: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required, Validators.pattern('^[_.@A-Za-z0-9-]*$')])
    });

  }

  ngOnInit() {
  }
  //
  //
  // resolved(captchaResponse: string) {
  //   console.log(`Resolved captcha with response: ${captchaResponse}`);
  //   this.recaptchaStr = captchaResponse;
  //
  //   if (this.recaptchaStr) {
  //     this.onRegister();
  //   }
  // }
  //

  // onRegisterClick(captchaRef: any): void {
  //   if (this.recaptchaStr) {
  //     captchaRef.reset();
  //   }
  //   captchaRef.execute();
  // }

  onRegister() {
    this.message = null;

    if (!this.registerForm.valid) {
      console.log('Register form is not valid !!!!');
    } else if (this.password !== this.passwordConfirm) {
      this.message = 'Les mots de passe ne sont pas identiques.';
    } else {
      const nom = this.nom;
      const prenom = this.prenom;
      const username = this.username;
      const email = this.email;
      const password = this.password;

      this.userService.register(
          prenom,
          nom,
          email,
          username,
          password,
          // this.recaptchaStr
      )
          .subscribe(
              (resp) => {
                console.log('Organisation registered');
                console.log(resp);
                swal({
                  icon: 'success',
                  text: 'Compte créé : le lien d\'activation est envoyé à l\'adresse mail fournie.'
                }).then(() => {
                  this.router.navigate(['/login']);
                });
              }
          );
    }
  }

}
