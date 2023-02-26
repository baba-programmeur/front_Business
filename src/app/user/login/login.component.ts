import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthService} from '../../_service/auth/auth.service';
import {CookieService} from 'ngx-cookie-service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Constant} from '../../_constant/constant';
import {UserService} from '../../_service/auth/user.service';

declare var swal;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  username = '';
  password = '';
  rememberMe = false;
  message: string;
  loginForm: FormGroup;
  recaptchaStr = '';

  constructor(private authService: AuthService,
              private cookieService: CookieService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl('', [])
    });
  }

  ngOnInit() {
    // check remember me
    this.rememberMe = (this.cookieService.get(Constant.IS_REMEMBER_ME) === 'true');
    if (this.rememberMe) {
      this.password = this.cookieService.get(Constant.REMEMBER_PASS);
      this.username = this.cookieService.get(Constant.REMEMBER_USER);
    }
  }

  /**
   *
   */
  ngAfterViewInit() {
    // if (this.authService.isLoggedIn()) {
    //   if (UserService.isAdmin()) {
    //     this.router.navigate(['/admin/dashboard']);
    //   } else if (UserService.isPartenaire()) {
    //     this.router.navigate(['/partenaire/dashboard']);
    //   }
    // } else {
    //   this.router.navigate(['/']);
    // }
  }

  onRememberMe(event) {
    this.rememberMe = event.checked;
  }

  resolved(captchaResponse: string) {
    this.recaptchaStr = captchaResponse;
    if (this.recaptchaStr) {
      this.onLogin();
    }
  }

  onLoginClick(): void {
  }

  onLogin() {
    this.message = null;

    if (!this.loginForm.valid) {
      console.log('Login form is not valid !!!');
      if (!this.username || this.username === '') {
        this.message = 'Veuillez saisir le nom d\'utilisateur.';
      } else if (!this.password || this.password === '') {
        this.message = 'Veuillez saisir le mot de passe.';
      } /*else if (!this.recaptcha || this.recaptcha === '') {
        this.message = 'Veuillez cocher le captcha.';
      }*/
    } else {
      // send login request
      this.authService.login(this.username, this.password, this.rememberMe, this.recaptchaStr)
          .toPromise()
          .then(
              resp => {
                console.log('___ logged in', resp);
                // if (UserService.isAdmin(resp)) {
                //   this.router.navigate(['/admin/dashboard']);
                // } else if (UserService.isAdminFinancier(resp)) {
                //   this.router.navigate(['/financier/dashboard']);
                // } else if (UserService.isPartenaire(resp)) {
                //   // TODO: mettre la redirection au cas ou l'objet souscription est null
                //   this.router.navigate(['/partenaire/dashboard']);
                // }
              });
    }
  }

}
