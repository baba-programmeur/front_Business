import {Component, HostListener, OnInit} from '@angular/core';
import {AuthService} from './_service/auth/auth.service';
import {Router} from '@angular/router';
import {LoaderService} from './_service/auth/loader.service';
import {delay} from 'rxjs/operators';
import {UserService} from './_service/auth/user.service';
import {NotificationService} from './_service/autre/notification.service';
import {ParameterService} from './_service/autre/parameter.service';
import {ConnectionService} from './_service/auth/connection.service';
import {ErrorHandlerService} from './_service/auth/error-handler.service';
import {MatDialog} from '@angular/material/dialog';
import {DetailsCampagneErrorComponent} from './custom/details-campagne/details-campagne-error/details-campagne-error.component';
import {SouscriptionActiveComponent} from './custom/partenaire/souscription-active/souscription-active.component';
import {SouscriptionDialogComponent} from './custom/partenaire/souscription-dialog/souscription-dialog.component';
import {SouscriptionService} from './_service/autre/souscription.service';

declare var swal;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    showLoadingIndicator = false;
    message;

     constructor(private router: Router,
                 private authService: AuthService,
                 private loaderService: LoaderService,
                 private userService: UserService,
                 private notificationService: NotificationService,
                 private connectionService: ConnectionService,
                 private errorHandlerService: ErrorHandlerService,
                 private parameterService: ParameterService,
                 private dialog: MatDialog
                 ) {
         this.loaderService.isLoading
             .pipe(
                 delay(0),
             )
             .subscribe((value => {
             this.showLoadingIndicator = value;
         }));
     }

    @HostListener('window:resize', ['$event'])
    onWindowResize(event: any) {
        if (event && event.srcElement && event.srcElement.screen) {
            const screen = event.srcElement.screen;
            this.parameterService.screenWidth = screen.availWidth;
            this.parameterService.screenHeight = screen.availHeight;
        }
    }

    ngOnInit() {
        // if (!this.authService.isLoggedIn()) {
        //     this.router.navigate(['/login']);
        // }

        /****************************
         * subscribe to mercure
         *******************************/
        // this.subscribeToMercure();

        sessionStorage.setItem('color', '#E67E04');

        // vérification de la disponibilité du serveur
        this.connectionService.isAvailable
            .pipe(
                delay(0),
            )
            .subscribe(
                (value => {
                    if (!value) {
                        swal({
                            icon: 'warning',
                            text: 'Service indisponible! Merci de réessayer plutard.'
                        });
                    }
                }));

        // gestion du loader
        this.loaderService.isLoading
            .pipe(
                delay(0),
            )
            .subscribe(
                (value => {
                    this.showLoadingIndicator = value;
                }));

        // affichage des erreurs
        this.errorHandlerService.hasError
            .pipe(
                delay(0),
            )
            .subscribe(
                (value => {
                    if (value) {
                        const message = this.errorHandlerService.message;
                        const code    = this.errorHandlerService.code;
                        const level   = this.errorHandlerService.level;

                        // tslint:disable-next-line:triple-equals
                        if (code == 100) {
                            const data = JSON.parse(message);
                            const detail = JSON.parse(data.detail);
                            const champ = data.champ;
                            const error = data.message;

                            this.dialog.open(DetailsCampagneErrorComponent, {
                                width: '450px',
                                data: {
                                    detail: detail,
                                    champ: champ,
                                    message: error
                                }
                            });
                        } else {
                            swal({
                                icon: level.toLowerCase(),
                                text: message + ' (' + code + ')'
                            }).then(() => {
                                // tslint:disable-next-line:triple-equals
                                if (code == 4005) {
                                    this.router.navigate(['/login']);
                                }
                            });
                        }
                    }
                }));
    }
}
