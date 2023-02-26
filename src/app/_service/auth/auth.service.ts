import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {ServerService} from './server.service';
import {Constant} from '../../_constant/constant';
import {CookieService} from 'ngx-cookie-service';
import {Observable, Subject} from 'rxjs';
import {SouscriptionService} from '../autre/souscription.service';
import {Router} from '@angular/router';
import {Souscription} from '../../_model/souscription';
import {User} from '../../_model/user';
import {Authorisation} from '../../_model/authorisation';
import {KeycloakService} from 'keycloak-angular';

class AuthResponse {
    private idToken: string;

    get id_token() {
        return this.idToken;
    }

    set id_token(token: string) {
        this.idToken = token;
    }
}

@Injectable()
export class AuthService {
    private ACCOUNT = new Subject<any>();
    private ORGANISATION = new Subject<any>();

    constructor(private http: HttpClient,
                private router: Router,
                private keycloakService: KeycloakService,
                private cookieService: CookieService,
                private serverService: ServerService) {

    }

    set account(account) {
        sessionStorage.setItem(Constant.ACCOUNT, JSON.stringify(account));
        this.ACCOUNT.next(account);
    }
    get account(): Subject<any> {
        return this.ACCOUNT;
    }
    set organisation(org) {
        this.ORGANISATION.next(org);
    }

    get organisation(): Subject<any> {
        return this.ORGANISATION;
    }

    login(username: string, password: string, rememberMe: boolean, recaptchaResponse: string) {
        // tslint:disable-next-line:max-line-length
        // return this.http.post<AuthResponse>(ServerService.baseUrl + 'authenticate/captcha', {username, password, rememberMe, recaptchaResponse})
        return this.http.post<AuthResponse>(ServerService.baseUrl + 'authenticate', {username, password, rememberMe, recaptchaResponse})
            .pipe(
                map((authResult: any) => {
                    console.log('Res', authResult);

                    const expiresAt = Date.now() + 86400 * 1000;

                    sessionStorage.setItem('id_token', authResult.id_token);
                    sessionStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()) );

                    // check remember me
                    if (rememberMe) {
                        this.cookieService.set(Constant.IS_REMEMBER_ME, 'true');
                        this.cookieService.set(Constant.REMEMBER_USER, username);
                        this.cookieService.set(Constant.REMEMBER_PASS, password);
                    } else {
                        this.cookieService.set(Constant.IS_REMEMBER_ME, 'false');
                        this.cookieService.delete(Constant.REMEMBER_USER);
                        this.cookieService.delete(Constant.REMEMBER_PASS);
                    }

                    /* get user account */
                    return this.getAccount();
                })
            );
    }

    getAccount() {
        return this.http.get(ServerService.baseUrl + 'user/account').toPromise()
            .then(
                (data: any) => {

                    console.log('___ User data');
                    console.log(data);

                    sessionStorage.setItem(Constant.ACCOUNT, JSON.stringify(data));
                    this.account = data;

                    return data;
                },
                error => {
                    this.logout();
                    this.router.navigate(['/login']);
                }
            );
    }

    logout() {
        const redirectUri = `${location.origin}`;
        console.log('----------- REDIRECT URI----------');
        console.log(redirectUri);
        this.keycloakService.logout(redirectUri).then(
            () => {
                console.log('deconnexion reussie.')
            }
        );
        sessionStorage.removeItem('id_token');
        sessionStorage.removeItem('expires_at');
        sessionStorage.removeItem('blocPartenaire');
        sessionStorage.removeItem('color');
        sessionStorage.removeItem(Constant.ACCOUNT);
        sessionStorage.removeItem(Constant.SOUSCRIPTION);
        sessionStorage.removeItem(Constant.SOUSCRIPTION_ID);
    }

    public isLoggedIn() {
        return this.keycloakService.getKeycloakInstance().authenticated;
        // return Date.now() < this.getExpiration();
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = sessionStorage.getItem('expires_at');
        return JSON.parse(expiration);
    }

    setSouscription(souscription) {
        console.log('+++++++++++ Objet à envoyer: ', souscription);
        return this.http.post(ServerService.baseUrl + 'partenaire/souscriptions', souscription);
    }

    getAuthorisations(user: User): Observable<any> {
        console.log('+++++++++++ Objet à envoyer: ', user);
        return this.http.get<any>(ServerService.baseUrl + 'authorisations' , {observe: 'response'})
            .pipe(
                tap(response => {
                    console.log(response);
                }),
                map(response => {
                    return this.serverService.extractData<any>(response, response.headers);
                })
            );
    }

    getSimplesAuthorisations(user: User): Observable<any> {
        console.log('+++++++++++ Objet à envoyer: ', user);
        return this.http.get<any>(ServerService.baseUrl + 'allAuthorisations' , {observe: 'response'})
            .pipe(
                tap(response => {
                    console.log(response);
                }),
                map(response => {
                    return this.serverService.extractData<any>(response, response.headers);
                })
            );
    }

    getUserAuthorisations(user: User): Observable<any> {
        console.log('+++++++++++ Objet à envoyer: ', user);
        return this.http.get<any>(ServerService.baseUrl + 'users/' + user.id + '/authorizations' , {observe: 'response'})
            .pipe(
                tap(response => {
                    console.log(response);
                }),
                map(response => {
                    return this.serverService.extractData<any>(response, response.headers);
                })
            );
    }

    setAuthorisationsUser(data: any, idUser): Observable<any> {
        return this.http.post<any>(ServerService.baseUrl + 'users/' + idUser + '/authorizations', data)
            .pipe(
                tap(response => {
                    console.log(response);
                }),
                map(response => {
                    return this.serverService.extractData<any>(response, response.headers);
                })
            );
    }
}















// import {Injectable} from '@angular/core';
// import {HttpClient} from '@angular/common/http';
// import {tap} from 'rxjs/operators';
// import {UserService} from './user.service';
// import {ServerService} from './server.service';
// import {Constant} from '../../_constant/constant';
// import {CookieService} from 'ngx-cookie-service';
// import {Subject} from 'rxjs';
// import {Compte} from '../../_model/compte';
//
// class AuthResponse {
//     private idToken: string;
//
//     get id_token() {
//         return this.idToken;
//     }
//
//     set id_token(token: string) {
//         this.idToken = token;
//     }
// }
//
// @Injectable()
// export class AuthService {
//     private ACCOUNT = new Subject<Compte>();
//     private plafond = new Subject<any>();
//
//     constructor(private http: HttpClient,
//                 private cookieService: CookieService,
//                 private userService: UserService) {
//
//     }
//
//     setCompte(account: Compte) {
//       this.ACCOUNT.next(account);
//     }
//
//     getCompte(): Subject<Compte> {
//       return this.ACCOUNT;
//     }
//
//     setPlafond(montant) {
//         this.plafond.next(montant);
//     }
//
//     getPlafond() {
//         return this.plafond;
//     }
//
//     login(username: string, password: string, rememberMe: boolean, recaptchaResponse: string) {
//         const body = {
//             grant_type: ServerService.grant_type,
//             client_id:  ServerService.client_id,
//             client_secret: ServerService.client_secret,
//             username: username,
//             password: password
//         };
//
//         return this.http.post<AuthResponse>(ServerService.baseUrl + 'oauth/v2/token', body)
//             .pipe(
//                 tap((authResult: any) => {
//                     console.log('Response auth : ', authResult);
//
//                     sessionStorage.setItem('upayb2b_id_token', authResult.access_token);
//                     sessionStorage.setItem('upayb2b_token_type', authResult.token_type);
//                     sessionStorage.setItem('upayb2b_scope', authResult.scope);
//
//                     if (authResult.refresh_token) {
//                         sessionStorage.setItem('upayb2b_refresh_token', authResult.refresh_token);
//                     }
//
//                     const expires_in: number = authResult.expires_in;
//                     const expiresAt = Date.now() + expires_in * 1000;
//
//                     sessionStorage.setItem('upayb2b_expires_at', JSON.stringify(expiresAt.valueOf()));
//
//                     // check remember me
//                     if (rememberMe) {
//                       this.cookieService.set(Constant.IS_REMEMBER_ME, 'true');
//                       this.cookieService.set(Constant.REMEMBER_USER, username);
//                       this.cookieService.set(Constant.REMEMBER_PASS, password);
//                     } else {
//                       this.cookieService.set(Constant.IS_REMEMBER_ME, 'false');
//                       this.cookieService.delete(Constant.REMEMBER_USER);
//                       this.cookieService.delete(Constant.REMEMBER_PASS);
//                     }
//
//                     // /* get user account */
//                     // return this.userService.getAccount()
//                     //     .subscribe(
//                     //       (data: any) => {
//                     //           sessionStorage.setItem(Constant.ACCOUNT, JSON.stringify(data));
//                     //           this.setCompte(data);
//                     //
//                     //           return data;
//                     //         },
//                     //       error => {
//                     //           console.error('Error', error);
//                     //           return error;
//                     //       }
//                     //     );
//                 })
//             );
//     }
//
//     logout() {
//       sessionStorage.removeItem('upayb2b_id_token');
//       sessionStorage.removeItem('upayb2b_expires_at');
//       sessionStorage.removeItem('upayb2b_token_type');
//       sessionStorage.removeItem('upayb2b_refresh_token');
//       sessionStorage.removeItem('upayb2b_scope');
//       sessionStorage.removeItem(Constant.ACCOUNT);
//     }
//
//     public isLoggedIn() {
//         const exp = this.getExpiration();
//         if (!exp) {
//             return false;
//         }
//
//         return Date.now() < this.getExpiration();
//     }
//
//     isLoggedOut() {
//         return !this.isLoggedIn();
//     }
//
//     getExpiration() {
//         const expiration = sessionStorage.getItem('upayb2b_expires_at');
//
//         if (!expiration) { return null; }
//
//         return JSON.parse(expiration);
//     }
// }
