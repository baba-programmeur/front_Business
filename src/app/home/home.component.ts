import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {CampagneService} from '../_service/autre/campagne.service';
import {SouscriptionService} from '../_service/autre/souscription.service';
import {UserService} from '../_service/auth/user.service';
import {Compte} from '../_model/compte';
import {Campagne} from '../_model/campagne';
import {DetailCampagne} from '../_model/detail-campagne';
import {CommunService} from '../_service/autre/commun.service';
import {AddCampagneComponent} from '../custom/add-campagne/add-campagne.component';
import {MatDialog} from '@angular/material';
import {AuthService} from '../_service/auth/auth.service';
import {NotificationService} from '../_service/autre/notification.service';
import {formatNumber} from '@angular/common';
import {Router} from '@angular/router';

const defaut_type = '';
const default_statut = '';
const default_periode = 'thisMonth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private router: Router, private authService: AuthService) {
    }

    ngOnInit(): void {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/partenaire/dashboard']);
        }
    }

    // dateDebut;
    // dateFin;
    // nom;
    // statut;
    // type;
    // id;
    // codeEs;
    // idUser;
    //
    // campagneControl = new FormControl();
    // statutControl   = new FormControl(default_statut);
    // typeControl     = new FormControl(defaut_type);
    // periodeControl  = new FormControl(default_periode);
    //
    // account: Compte;
    // campagnes: Campagne[];
    // detailsCampagne: DetailCampagne[];
    // typeCampagne = null;
    // selectedCampagne: Campagne;
    //
    // initiePercent         = 0;
    // partielPercent        = 0;
    // validePercent         = 0;
    // echecPercent          = 0;
    // initieMontantPercent  = 0;
    // partielMontantPercent = 0;
    // valideMontantPercent  = 0;
    // echecMontantPercent   = 0;
    // nbInitie              = 0;
    // nbPartiel             = 0;
    // nbValide              = 0;
    // nbEchoue              = 0;
    // nbBloque              = 0;
    // total                 = 0;
    // montantPaye           = '0';
    // montantTotal          = '0';
    //
    // filteredCampagnes: Observable<Campagne[]>;
    //
    // constructor(public dialog: MatDialog,
    //             private campagneService: CampagneService,
    //             private userService: UserService,
    //             private authService: AuthService,
    //             private communService: CommunService,
    //             private notificationService: NotificationService,
    //             private souscriptionService: SouscriptionService) {}
    //
    // ngOnInit() {
    //     // get account
    //     this.account = this.userService.getAccountFromStorage();
    //     if (this.account) {
    //         this.initDashboard(this.account);
    //     } else {
    //         this.authService.account.subscribe (
    //             account => {
    //                 if (account) {
    //                     this.initDashboard(account);
    //                 }
    //             }
    //         )
    //     }
    //
    //     // Mise à jour en temps réél
    //     this.liveUpdate();
    // }
    //
    //
    // /**
    //  * Mise à jour du tableau de bord
    //  * En utilisant les push de notifications
    //  */
    // liveUpdate() {
    //     this.notificationService.pushData
    //         .subscribe(
    //             (data) => {
    //                 console.log('_____ DATA FROM PAYMENT');
    //                 console.log(data);
    //
    //                 if (data && data.type === 'payment') {
    //                     const idCampagne   = +data.campagneId;
    //                     const idDetail     = +data.detailId;
    //                     const statutDetail = data.detailStatut;
    //
    //                     const plafond      = data.plafond;
    //
    //                     if (this.selectedCampagne.id === idCampagne) {
    //                         this.selectedCampagne.type   = data.campagneType;
    //                         this.selectedCampagne.status = data.campagneStatut;
    //
    //                         this.nbPartiel   = +data.partiel;
    //                         this.nbValide    = +data.valide;
    //                         this.nbEchoue    = +data.erreur;
    //                         this.nbBloque    = +data.bloque;
    //                         this.nbInitie    = +data.initie;
    //
    //                         const montantInitie  = parseFloat(data.montantInitie);
    //                         const montantPartiel = parseFloat(data.montantPartiel);
    //                         const montantValide  = parseFloat(data.montantValide);
    //                         const montantEchec   = parseFloat(data.montantErreur);
    //                         const montantBloque  = parseFloat(data.montantBloque);
    //
    //                         this.montantPaye = formatNumber(data.montantPaye, 'fr-FR');
    //
    //                         const total = this.nbInitie + this.nbPartiel + this.nbBloque + this.nbEchoue + this.nbValide;
    //
    //                         this.initiePercent  = (this.nbInitie / total) * 100;
    //                         this.partielPercent = (this.nbPartiel / total) * 100;
    //                         this.echecPercent   = ((this.nbEchoue + this.nbBloque) / total) * 100;
    //                         this.validePercent  = (this.nbValide / total) * 100;
    //
    //
    //                         this.initieMontantPercent  = (montantInitie / total) * 100;
    //                         this.partielMontantPercent = (montantPartiel / total) * 100;
    //                         this.echecMontantPercent   = ((montantEchec + montantBloque) / total) * 100;
    //                         this.valideMontantPercent  = (montantValide / total) * 100;
    //
    //                         if (this.detailsCampagne) {
    //                             for (let detail of this.detailsCampagne) {
    //                                 if (detail.id === idDetail) {
    //                                     detail.payer = statutDetail;
    //                                 }
    //                             }
    //                         }
    //
    //                         // update plafond
    //                         if (plafond) {
    //                             const mnt = +plafond.montant;
    //
    //                             // this.authService.setPlafond(mnt.toLocaleString("fr-FR"));
    //                         }
    //                     }
    //                 }
    //             }
    //         );
    // }
    //
    // /**
    //  *
    //  * @param account
    //  */
    // initDashboard(account: Compte) {
    //     const periode = CommunService.getPeriode(default_periode);
    //
    //     console.log('______ Période _____');
    //     console.log(periode);
    //
    //     this.dateDebut = periode.dateDebut;
    //     this.dateFin   = periode.dateFin;
    //
    //     if (account) {
    //         this.id = account.souscription.id;
    //         this.codeEs = account.souscription.code_partenaire;
    //     }
    //
    //     this.type = defaut_type;
    //     this.statut = default_statut;
    //
    //     this.getCampagnes();
    // }
    //
    //
    // getSouscriptions() {
    //     this.souscriptionService.getSouscriptions()
    //         .subscribe(
    //             (campagnes: []) => {
    //                 console.log('______ Souscriptions _________');
    //                 console.log(campagnes);
    //             }
    //         );
    // }
    //
    // getCampagnes() {
    //     this.reset();
    //
    //     this.campagneService.getCampagnes(this.nom, this.dateDebut, this.dateFin, this.idUser, this.codeEs, this.statut, this.type)
    //         .subscribe(
    //             (campagnes: Campagne[]) => {
    //                 console.log('______ Campagnes _________');
    //                 console.log(campagnes);
    //                 this.campagnes = campagnes;
    //
    //                 if (this.campagnes && this.campagnes.length !== 0) {
    //                     this.campagnes.sort((a, b) => {
    //                         return (a.id >= b.id)?-1:1;
    //                     });
    //
    //                     this.selectedCampagne = this.campagnes[0];
    //
    //                     this.campagneControl.setValue( this.selectedCampagne.nom);
    //                     this.getDetails(this.selectedCampagne.id);
    //                 }
    //
    //                 this.filteredCampagnes = this.campagneControl.valueChanges.pipe(
    //                     startWith(''),
    //                     map(value => this._filter(value))
    //                 );
    //             }
    //         );
    // }
    //
    // onSelectCampagne(campagne) {
    //     this.selectedCampagne = campagne;
    //     console.log('___________ Campagne selected ________');
    //     console.log(this.selectedCampagne.id);
    //
    //     // get details
    //     this.getDetails(this.selectedCampagne.id);
    // }
    //
    // onSelectPeriode(event) {
    //     console.log('____ Periode _____');
    //     console.log(event.value);
    //
    //     const value = event.value;
    //
    //     this.periodeControl.setValue(value);
    //     const periode = CommunService.getPeriode(value);
    //     console.log(periode);
    //
    //     this.dateDebut = periode.dateDebut;
    //     this.dateFin   = periode.dateFin;
    //
    //     this.getCampagnes();
    // }
    //
    // onSelectType(event) {
    //     console.log('____type _____');
    //     console.log(event.value);
    //
    //     this.typeControl.setValue(event.value);
    //     this.type = event.value;
    //
    //     this.getCampagnes();
    // }
    //
    // onSelectStatut(event) {
    //     console.log('____type _____');
    //     console.log(event.value);
    //
    //     this.statutControl.setValue(event.value);
    //     this.statut = event.value;
    //     this.getCampagnes();
    // }
    //
    // getDetails(id) {
    //     this.detailsCampagne = [];
    //
    //     this.campagneService.getDetails(id)
    //         .subscribe(
    //             (details: DetailCampagne[]) => {
    //                 this.detailsCampagne = details;
    //
    //
    //                 // get agregats
    //                 const agregats = CampagneService.getAgregats(this.detailsCampagne);
    //                 this.nbInitie              = agregats.initie;
    //                 this.nbPartiel             = agregats.partiel;
    //                 this.nbValide              = agregats.valide;
    //                 this.nbEchoue              = agregats.echoue;
    //                 this.nbBloque              = agregats.bloque;
    //                 this.total                 = agregats.total;
    //                 this.montantPaye           = agregats.montantPaye;
    //                 this.montantTotal          = agregats.montantTotal;
    //                 this.initiePercent         = agregats.initiePercent;
    //                 this.partielPercent        = agregats.partielPercent;
    //                 this.validePercent         = agregats.validePercent;
    //                 this.echecPercent          = agregats.echecPercent;
    //                 this.initieMontantPercent  = agregats.initieMontantPercent;
    //                 this.partielMontantPercent = agregats.partielMontantPercent;
    //                 this.valideMontantPercent  = agregats.valideMontantPercent;
    //                 this.echecMontantPercent   = agregats.echecMontantPercent;
    //             }
    //         );
    // }
    //
    // private _filter(value: string): Campagne[] {
    //     const filterValue = value.toLowerCase();
    //
    //     return this.campagnes.filter((campagne: Campagne) => campagne.nom.toLowerCase().indexOf(filterValue) === 0);
    // }
    //
    // openDialog(): void {
    //     const dialogRef = this.dialog.open(AddCampagneComponent, {
    //         width: '1200px'
    //     });
    //
    //     dialogRef.afterClosed().subscribe(result => {
    //         if (result && !result.canceled) {
    //             this.getCampagnes();
    //         }
    //     });
    // }
    //
    // formatDate(date: string) {
    //     if (!date) {
    //         return '';
    //     }
    //
    //     const annee  = date.slice(0, 4);
    //     const mois   = date.slice(4, 6);
    //     const jour   = date.slice(6, 8);
    //     const heure  = date.slice(8, 10);
    //     const minute = date.slice(10, 12);
    //
    //     return jour + '/' + mois + '/' + annee + ' ' + heure + ':' + minute;
    // }
    //
    // reset() {
    //     this.campagnes = [];
    //     this.detailsCampagne = [];
    //     this.campagneControl.setValue('');
    //
    //     this.initiePercent  = 0;
    //     this.partielPercent = 0;
    //     this.validePercent  = 0;
    //     this.echecPercent   = 0;
    //     this.initieMontantPercent  = 0;
    //     this.partielMontantPercent = 0;
    //     this.valideMontantPercent  = 0;
    //     this.echecMontantPercent   = 0;
    //
    //     this.nbInitie     = 0;
    //     this.nbPartiel    = 0;
    //     this.nbValide     = 0;
    //     this.nbEchoue     = 0;
    //     this.nbBloque     = 0;
    //     this.total        = 0;
    //     this.montantPaye  = '0';
    //     this.montantTotal = '0';
    //     this.selectedCampagne = null;
    // }

}
