import {Component, ElementRef, OnInit} from '@angular/core';
import {ROUTES} from '../../sidebar/sidebar.component';
import {Location} from '@angular/common';
import {AuthService} from '../../_service/auth/auth.service';
import {UserService} from '../../_service/auth/user.service';
import {MatDialog} from '@angular/material/dialog';
import {MouvementService} from '../../_service/autre/mouvement.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {SouscriptionService} from '../../_service/autre/souscription.service';
import {LoaderService} from '../../_service/auth/loader.service';
import {ProfilFraisService} from '../../_service/autre/profil-frais.service';
import {KeycloakService} from 'keycloak-angular';

const getCountryISO2 = require('country-iso-3-to-2');
declare var swal;

@Component({
    selector: 'app-navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    listTitles: any[];
    location: Location;
    toggleButton: any;
    sidebarVisible: boolean;
    account: any;
    userInfo: any;
    roles: any[];
    username: string;
    codeEs: string;
    nomEs: string;
    devise = 'XOF';
    solde: number = null;
    pays_flag;
    pays: string;

    isAdmin = false;
    isPartenaire = false;
    isPartenaireFinancier = false;
    isAdminFinancier = false;
    rotate = false;

    constructor(location: Location,
                public dialog: MatDialog,
                private element: ElementRef,
                private authService: AuthService,
                private mouvementService: MouvementService,
                private userService: UserService,
                private loading: LoaderService,
                private keycloakService: KeycloakService,
                private souscriptionService: SouscriptionService,
                private profilFraisService: ProfilFraisService,
                private router: Router
    ) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {

        this.userInfo = this.userService.getUserInfo();
        this.roles    = this.userService.getRolesForAuthenticatedUser();


        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        // TODO: listen for update plafond

        // check if user is admin
        if (this.userService.isAdmin()) {
            this.isAdmin = true;
        } else if (UserService.isAdminFinancier()) {
            this.isAdminFinancier = true;
        } else if (UserService.isPartenaireFinancier()) {
            this.isPartenaireFinancier = true;
            if (!this.isPartenaire) {
                this.isPartenaire = true;
            }
        } else if (this.userService.isPartenaire()) {
            if (!this.isPartenaire) {
                this.isPartenaire = true;
            }
        }


        this.authService.account
            .subscribe(
                (account: any) => {
                    this.account = account;
                    console.log('nav bar on init account *****',account.souscription)
                    if (this.account.souscription) {
                        if(account.souscription.raison_sociale){
                            console.log("partner  ++++++++++ ",account.souscription.raison_sociale.toUpperCase());
                            localStorage.setItem("partner",account.souscription.raison_sociale.toUpperCase());
                        }else{
                            console.log("prenom ++++++++++ ", account.souscription.nom);
                            localStorage.setItem("partner",account.souscription.prenom.toUpperCase().concat("_").concat(account.souscription.nom.toUpperCase()));
                        }
                        if (this.account.souscription.solde && this.account.souscription.consomme) {
                         //   
                            //this.solde = (+this.account.souscription.solde) - (+this.account.souscription.consomme);
                        }
                        this.pays =  this.account.souscription.pays;
                        // tslint:disable-next-line:max-line-length
                        //this.pays_flag = 'https://lipis.github.io/flag-icon-css/flags/4x3/' + getCountryISO2(this.pays).toLowerCase() + '.svg'
                        this.pays_flag = 'assets/img/4x3/' + getCountryISO2(this.pays).toLowerCase() + '.svg'
                        console.log("**** flag : "+this.pays_flag);
                    }
                    this.setUserInfo();
                }, (error) => {
                }
            );
    }

    setUserInfo() {
        console.log('__________ User account _________');
        console.log(this.account);

        if (this.account) {
            if (this.account.souscription) {
                this.rafraichirSolde();
                this.codeEs = this.account.souscription.code_partenaire;
                this.solde = this.account.souscription.solde;
                // tslint:disable-next-line:max-line-length
                this.nomEs = (this.account.souscription.raison_sociale && this.account.souscription.raison_sociale !== '') ? this.account.souscription.raison_sociale : this.account.souscription.prenom + ' ' + this.account.souscription.nom;
               // localStorage.setItem("partner",this.account.souscription.raison_sociale);
            } else {
                if (!this.userService.isAdmin() && !this.userService.isSuperAdmin()) {
                    this.findSouscription();
                }
            }
        }
    }

    findSouscription(): void {
        this.souscriptionService.findSouscription()
            .subscribe(
                (resp: any) => {
                    if (resp) {
                        this.account.souscription = resp;
                        this.pays =  this.account.souscription.pays;
                        // tslint:disable-next-line:max-line-length
                        this.pays_flag = 'https://lipis.github.io/flag-icon-css/flags/4x3/' + getCountryISO2(this.pays).toLowerCase() + '.svg'
                        this.findProfilFrais();
                        this.authService.account = this.account;
                    }
                }
            );
    }

    findProfilFrais() {
        this.profilFraisService.getProfilsFraisBySouscription(+this.account.souscription.id)
            .subscribe(
                (resp: any[]) => {
                    if (resp) {
                        this.account.frais = resp;
                        this.authService.account = this.account;
                    }
                }
            )
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');
        this.sidebarVisible = true;
    };

    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };

    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    parseRole(role: string): string {
        const tab = role.split(':');
        return tab[0];
    }

    getDetailsMouvement() {
        this.mouvementService.showMouvement.next(true);
    }

    goToProfil(): void {
        this.keycloakService.getKeycloakInstance().accountManagement();
        // window.open(environment.keycloakUrl + '/realms/' + environment.keycloakRealm + '/account/?', '_blank');
    }

    logout() {
        swal({
            text: 'Vous voulez vous déconnecter ?',
            closeOnClickOutside: false,
            buttons: {
                cancel: {
                    text: 'NON',
                    value: false,
                    visible: true,
                    className: 'cancel',
                    closeModal: true,
                    position: 'middle'
                },
                confirm: {
                    text: 'OUI',
                    value: true,
                    visible: true,
                    className: 'confirm',
                    closeModal: true
                },
            }
        }).then(
            result => {
                console.log('___ swal result : ', result);
                if (result) {
                    if (!this.authService.isLoggedIn()) {
                        this.router.navigate(['/']);
                    } else {
                        this.loading.show();
                        setTimeout(
                            () => {
                                this.authService.logout();
                                this.loading.hide();
                            },
                        1000);
                    }
                }
            }
        );
    }

    rafraichirSolde() {
        this.rotate = true;
        this.souscriptionService.consulterSolde(this.account.souscription.id)
            .subscribe(
                (resp: any) => {
                    if (resp) {
                        // console.log('Reponse demande de solde', resp);
                        // if (resp.solde && resp.consomme) {
                        console.log('Demande de solde : ', resp);
                        this.solde = (+resp.solde) - (+resp.consomme);
                        this.account.souscription.solde = resp.solde;
                        this.account.souscription.consomme = resp.consomme;
                        this.userService.setAccountFromStorage(this.account);
                        setTimeout(() => {
                            this.rotate = false;
                        },1000);

                        // } else {
                            // console.log('Solde non disponible');
                        // }
                    } else {
                        console.log('solde indisponible');
                    }
                }
            );
    }
}
