import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, finalize, timeout} from 'rxjs/operators';

import {LoaderService} from './loader.service';
import {ConnectionService} from './connection.service';
import {ErrorHandlerService} from './error-handler.service';
import {KeycloakService} from 'keycloak-angular';
import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(public loaderService: LoaderService,
                public keycloakService: KeycloakService,
                public authService: AuthService,
                public connectionService: ConnectionService,
                public errorHandlerService: ErrorHandlerService) {
    }

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {
        const API_TIMEOUT = 120000;

        if (!window.navigator.onLine) {
            this.connectionService.offline();
        } else {
            this.connectionService.online(  );

            console.log('___Start http request !!!');
            this.connectionService.available();

            this.loaderService.show();

            const keycloakInstance = this.keycloakService.getKeycloakInstance();

            const idToken = keycloakInstance.token;

            if (idToken) {
                req = req.clone
                (
                    {
                        headers: req.headers.set('Authorization', 'Bearer ' + idToken)
                    }
                );
            }

            return next.handle(req)
                .pipe(
                    finalize(() => {
                        console.log('______End of http request !!!');
                        this.loaderService.hide();
                    }),
                    timeout(API_TIMEOUT),
                    catchError((err, caught) => {
                        console.log('__ Error __');
                        console.log(err);
                        if (err.status === 0) {
                            this.connectionService.unAvailable();
                        } if (err.status && err.status === 403) {
                            if (this.keycloakService.isTokenExpired()) {
                                this.errorHandlerService.showError('Votre session a expiré !!!', '403', 'ERROR');
                                this.authService.logout();
                            } else {
                                this.errorHandlerService.showError('Impossible de trouver la ressource demandée.', '403', 'ERROR');
                            }
                        } else {
                            this.connectionService.available();
                            if (err.error) {
                                const error = err.error;
                                if (error.code && error.message && error.level) {
                                    // Error détails
                                    if (error.code === 10000) {
                                        console.log('----------------------------');
                                        console.log(JSON.parse(error.message));
                                        console.log('----------------------------');
                                        // tslint:disable-next-line:max-line-length
                                        error.message = JSON.parse(error.message).erreur.message + ' pour le client ' + JSON.parse(error.message).details.idclient;
                                    }
                                    this.errorHandlerService.showError(error.message, error.code, error.level);
                                } else if (error.status) {
                                    if (error.status === 404) {
                                        this.errorHandlerService.showError(error.title, error.status, 'ERROR');
                                    } else {
                                        if (error.status === 500) {
                                            if (error.detail && error.detail !== '') {
                                                // Error 500
                                                // tslint:disable-next-line:max-line-length
                                                this.errorHandlerService.showError('Impossible d\'effectuer cette opération. Merci de reessayer.', '500', 'ERROR');
                                            } else {
                                                // tslint:disable-next-line:max-line-length
                                                this.errorHandlerService.showError('Impossible d\'effectuer cette opération. Merci de reessayer.', '400', 'ERROR');
                                            }
                                        } else {
                                            // tslint:disable-next-line:max-line-length
                                            console.log(err.error);
                                            if (err.error.detail && err.error.detail.length > 100) {
                                                // tslint:disable-next-line:max-line-length
                                                this.errorHandlerService.showError('Impossible d\'effectuer cette opération. Merci de reessayer.', '500', 'ERROR');
                                            } else {
                                                this.errorHandlerService.showError(err.error.detail, '500', 'ERROR');
                                            }
                                        }
                                    }
                                } else if (error instanceof Blob) {

                                }
                            }
                        }
                        throw err;
                    })
                );
        }
    }
}















// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { catchError, finalize } from 'rxjs/operators';
// import { LoaderService } from './loader.service';
// import {ErrorHandlerService} from './error-handler.service';
// import {ConnectionService} from './connection.service';
//
// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//     constructor(public loaderService: LoaderService,
//                 private connectionService: ConnectionService,
//                 private errorHandlerService: ErrorHandlerService) {}
//
//     intercept(req: HttpRequest<any>,
//               next: HttpHandler): Observable<HttpEvent<any>> {
//
//         console.log('___Start http request !!!');
//         this.loaderService.show();
//
//         const idToken = sessionStorage.getItem('upayb2b_id_token');
//
//         let customReq;
//
//         if (idToken) {
//           customReq = req.clone
//           (
//             {
//               headers: req.headers.set('Authorization', 'Bearer ' + idToken)
//             }
//           );
//         } else {
//             customReq = req;
//         }
//
//         return next.handle(customReq).pipe(
//             finalize(() => {
//                 console.log('______End of http request !!!');
//                 this.loaderService.hide();
//             }),
//             catchError((err, caught) => {
//                 if (err.status === 0) {
//                     this.connectionService.unAvailable();
//                 } else {
//                     this.connectionService.available();
//
//                     if (err.error) {
//                         const error = err.error;
//                         if (error.code && error.message && error.niveau) {
//                             this.errorHandlerService.showError(error.message, error.code, error.niveau);
//                         }
//                     }
//                 }
//                 throw err;
//             })
//         );
//
//     }
// }
