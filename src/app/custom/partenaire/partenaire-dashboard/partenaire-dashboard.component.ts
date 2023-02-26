import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Campagne} from '../../../_model/campagne';
import {CampagneService} from '../../../_service/autre/campagne.service';
import {UserService} from '../../../_service/auth/user.service';
import {AuthService} from '../../../_service/auth/auth.service';
import {CommunService} from '../../../_service/autre/commun.service';
import {NotificationService} from '../../../_service/autre/notification.service';
import {SouscriptionService} from '../../../_service/autre/souscription.service';
import {SouscriptionDialogComponent} from '../souscription-dialog/souscription-dialog.component';
import {PaiementIndividuelComponent} from '../../paiement-individuel/paiement-individuel.component';
import {WebsocketSubscriberService} from '../../../_service/webSocket/websocket-subscriber.service';
import {PartenaireMouvementComponent} from '../partenaire-mouvement/partenaire-mouvement.component';
import {MouvementService} from '../../../_service/autre/mouvement.service';
import {AddCampagneComponent} from '../../add-campagne/add-campagne.component';
import {FormulaireData} from '../../../_model/formulaire-data';
import {SouscriptionActiveComponent} from '../souscription-active/souscription-active.component';
import {Router} from '@angular/router';
import { typeCanalDTO } from 'app/_model/typeCanalDTO';
import { forEach } from '@angular/router/src/utils/collection';

const defaut_type = '';
const default_statut = '';
const default_periode = 'thisMonth';

declare var swal;

@Component({
  selector: 'app-partenaire',
  templateUrl: './partenaire-dashboard.component.html',
  styleUrls: ['./partenaire-dashboard.component.scss']
})
export class PartenaireDashboardComponent implements OnInit {
  dateDebut;
  dateFin;
  nom;
  statut;
  type;
  id;
  codeEs;
  idUser;

  campagneControl = new FormControl();
  statutControl   = new FormControl(default_statut);
  typeControl     = new FormControl(defaut_type);
  periodeControl  = new FormControl(default_periode);

  account: any;
  campagnes: Campagne[];
  detailsCampagne: FormulaireData[];
  typeCampagne = null;
  selectedCampagne: Campagne;
  totalItems: number;
  initiePercent         = 0;
  envoyePercent         = 0;
  expirePercent         = 0;
  partielPercent        = 0;
  validePercent         = 0;
  echecPercent          = 0;
  initieMontantPercent  = 0;
  partielMontantPercent = 0;
  valideMontantPercent  = 0;
  echecMontantPercent   = 0;
  envoyeMontantPercent   = 0;
  expireMontantPercent   = 0;
  nbInitie              = 0;
  nbPartiel             = 0;
  nbValide              = 0;
  nbEchoue              = 0;
  nbBloque              = 0;
  nbEnvoye              = 0;
  nbExpire              = 0;
  total                 = 0;
  montantPaye           = '0';
  montantTotal          = '0';

  filteredCampagnes: Campagne[];

  constructor(public dialog: MatDialog,
              private campagneService: CampagneService,
              private userService: UserService,
              private authService: AuthService,
              private notificationService: NotificationService,
              private souscriptionService: SouscriptionService,
              private mouvementService: MouvementService,
              private router: Router,
              private websocketSubscriberService: WebsocketSubscriberService) {
  }

  ngOnInit() {
    this.initDashboard();

    if (this.router.getCurrentNavigation()) {
        swal({
            text: 'Votre campagne est lancée avec succès et est en cours de traitement.',
            closeOnClickOutside: false,
            buttons: {
                cancel: {
                    text: 'Fermer',
                    value: true,
                    visible: true,
                    className: 'confirm',
                    closeModal: true
                },
            }
        }).then(
            (result) => {
              console.log("_____result from partenaire-dashboard",result)
            }
        );
        console.log('++++++++++++++++++ Navigations extras +++++++++++++++++++++');
        console.log(this.router.getCurrentNavigation().extras.state);
    }

    // init partenaire websocket
    this.websocketSubscriberService.initPartenaireWebSocket();

    // refresh campagne
    this.campagneService.currentCampagne.subscribe(
        campagne => {
          if (this.selectedCampagne) {
            if (campagne && campagne.id === this.selectedCampagne.id && !localStorage.getItem('typeCanalChoosen')) {
              this.onSelectCampagne(campagne);
            }
          }
        }
    );

    // get list of mouvements
    this.mouvementService.showMouvement.subscribe(
        val => {
          if (val) {
            this.getPartenaireMouvements();
            this.mouvementService.showMouvement.next(false);
          }
        }
    );

    // get account
    this.account = this.userService.getUserInfo();

    this.findSouscription();

    // Mise à jour en temps réél
    this.liveUpdate();
  }


  findSouscription() {
    this.souscriptionService.findSouscription()
          .subscribe(
              (resp: any) => {
                  if (!resp) {
                      // TODO: revoir le comportement avant de valider
                      if (this.userService.isPartenaire()) {
                          setTimeout(() => {
                                  sessionStorage.setItem('blocPartenaire', 'bloque');
                                  this.openSouscription();
                              }
                              , 500);
                      }
                  } else {
                      this.account.souscription = resp;
                      this.authService.account = this.account;
                      if (resp.statut === 'nv') {
                          sessionStorage.setItem('blocPartenaire', 'bloque');
                          this.blocPartenaire();
                      } else {
                          sessionStorage.removeItem('blocPartenaire');
                      }
                  }
              }
          );
  }

  blocPartenaire() {
      // find formulaire
      this.dialog.open(SouscriptionActiveComponent, {
        width: '400px',
        disableClose: true,
        data: {}
      })
          .afterClosed()
          .subscribe(val => {});
  }

  /**
   * Mise à jour du tableau de bord
   * En utilisant les push de notifications
   */
  liveUpdate() {
    this.notificationService.pushData
        .subscribe(
            (data) => {
              console.log('_____ DATA FROM PAYMENT ____');
              console.log(data);
            }
        );
  }


  /**
   *
   * @param account
   */
  initDashboard() {
    const account = this.userService.getUserInfo();

    const periode = CommunService.getPeriode(default_periode);

    this.dateDebut = periode.dateDebut;
    this.dateFin   = periode.dateFin;

    if (account && account.souscription) {
      this.id = account.souscription.id;
      this.codeEs = account.souscription.code_partenaire;
    }

    this.type = defaut_type;
    this.statut = default_statut;

    this.getCampagnes();
  }


  getSouscriptions() {
    this.souscriptionService.getSouscriptions()
        .subscribe(
            (campagnes: []) => {
              console.log('______ Souscriptions _________');
              console.log(campagnes);
            }
        );
  }

  getCampagnes() {
    this.reset();
    this.campagneService.getCampagnes(this.nom, this.dateDebut, this.dateFin, this.idUser, this.codeEs, this.statut, this.type)
        .subscribe(
            (campagnes: Campagne[]) => {
              this.campagnes = campagnes;

              if (this.campagnes && this.campagnes.length !== 0) {
                this.campagnes.sort((a, b) => {
                  return (a.id >= b.id) ? -1 : 1;
                });

                this.selectedCampagne = this.campagnes[0];

                this.campagneControl.setValue(this.selectedCampagne.nom);
                this.getDetails(this.selectedCampagne.id);
              }

              this.filteredCampagnes = this.campagnes;

              /*this.filteredCampagnes = this.campagneControl.valueChanges.pipe(
                  startWith(''),
                  map(value => this._filter(value))
              );*/
            }
        );
  }

  onSelectCampagne(campagne) {
    console.log('___ campagne ___ from partenaire-dashboard');
    console.log(campagne);

    this.selectedCampagne = campagne;

    // get details
    this.getDetails(this.selectedCampagne.id);
  }

  onSelectPeriode(event) {
    const value = event.value;

    this.periodeControl.setValue(value);
    const periode = CommunService.getPeriode(value);
    console.log(periode);

    this.dateDebut = periode.dateDebut;
    this.dateFin   = periode.dateFin;

    this.getCampagnes();
  }

  onSelectType(event) {
    this.typeControl.setValue(event.value);
    this.type = event.value;
    this.getCampagnes();
  }

  onSelectStatut(event) {
    this.statutControl.setValue(event.value);
    this.statut = event.value;
    this.getCampagnes();
  }

  getDetails(id) {
    this.detailsCampagne = [];

    // if(true){

    // }else{
      
    //   this.campagneService.getDetails("nothing",id, 1).toPromise().then(
    //     (result) => {
    //       this.totalItems = +result.totalItems;
    //       this.detailsCampagne = result.data;
      
       
    //       console.log('============================= RESULT =====================================');
    //       console.log(result);

    //       console.log('============================= DETAILS CAMPAGNES =====================================');
          
    //       console.log(this.detailsCampagne);

    //       // // get agregats
    //       this.findStatique();
    //     },(error)=>{

    //     }
    // );
    // }

    this.campagneService.getTypeCanalByIdCampagne(id).subscribe(
      {
        next : (data:typeCanalDTO)=>{
          
          console.log("_____ data ___",data);
          console.log("_____ data.libelle ___",data.libelle);
          console.log("_____ data.actif ___",data.actif);

          if(data.actif.toLocaleLowerCase() ==='true'){
            localStorage.setItem("typeCanalChoosen",data.libelle);
            this.campagneService.getDetails(data.libelle,id, null,null,null,).toPromise().then(
              (result) => {
                this.totalItems = +result.totalItems;
                this.detailsCampagne = result.data;
              if(data.libelle.toLowerCase() === 'wallet'){
                this.detailsCampagne.forEach((item)=>{
    
                  item['statut'] = this.campagneService.translateStatus(item['statut'].toLowerCase());
                  
                })
              }
             
                console.log('============================= RESULT =====================================');
                console.log(result);
  
                console.log('============================= DETAILS CAMPAGNES =====================================');
                
                console.log(this.detailsCampagne);
  
                // // get agregats
                this.findStatique();
              }
          );
          }else{
              console.log('============================= NOT WALLET =====================================');
              this.campagneService.getDetails("nothing",id, 1).toPromise().then(
              (result) => {
                this.totalItems = +result.totalItems;
                this.detailsCampagne = result.data;
                console.log('============================= RESULT =====================================');
                console.log(result);
                console.log('============================= DETAILS CAMPAGNES =====================================');          
                console.log(this.detailsCampagne);
  
              
                this.findStatique();
              }
          );
          }
        }
      }
    );
    
    
  }

  private _filter(value: string): Campagne[] {
    const filterValue = value.toLowerCase();
    return this.campagnes.filter((campagne: Campagne) => campagne.nom.toLowerCase().indexOf(filterValue) === 0);
  }

  findStatique() {
      this.campagneService.getStatistiqueFromCampagne(this.selectedCampagne.id)
          .subscribe(
              (agregats: any) => {
                  console.log('====================== Agregate ==========================');
                  console.log(agregats);
                  this.nbInitie              = agregats.nbInitie;
                  this.nbEnvoye              = agregats.nbEnvoye;
                  this.nbExpire              = agregats.nbExpire;
                  this.nbPartiel             = agregats.nbPartiel;
                  this.nbValide              = agregats.nbValide;
                  this.nbEchoue              = agregats.nbEchoue;
                  this.nbBloque              = agregats.nbBloque;
                  this.total                 = agregats.total;
                  this.montantPaye           = agregats.montantPaye;
                  this.montantTotal          = agregats.montantTotal;
                  this.initiePercent         = agregats.initiePercent;
                  this.partielPercent        = agregats.partielPercent;
                  this.validePercent         = agregats.validePercent;
                  this.echecPercent          = agregats.echecPercent;
                  this.envoyePercent          = agregats.envoyePercent;
                  this.expirePercent          = agregats.expirePercent;
                  this.initieMontantPercent  = agregats.initieMontantPercent;
                  this.partielMontantPercent = agregats.partielMontantPercent;
                  this.valideMontantPercent  = agregats.valideMontantPercent;
                  this.echecMontantPercent   = agregats.echecMontantPercent;
                  this.envoyeMontantPercent   = agregats.envoyeMontantPercent;
                  this.expireMontantPercent   = agregats.expireMontantPercent;
              }
          )
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddCampagneComponent, {
      width: '1200px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && !result.canceled) {
        this.getCampagnes();
      }
    });
  }


  openSouscription() {
    // find formulaire
    this.dialog.open(SouscriptionDialogComponent, {
      width: '900px',
      disableClose: true,
      data: {}
    })
        .afterClosed().subscribe(val => {
      if (val) {
        if (val.submit) {
          this.findSouscription();
        }
      }
    });
  }

  onIndivPayment(canal) {
    const dialogRef = this.dialog.open(PaiementIndividuelComponent, {
      width: '1200px',
      data: {
        typeCanal : canal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('+++++++++++++ paiement indiv fermer: ', result);
      if (result && !result.canceled) {
        this.getCampagnes();
      }
    });
  }
  onIndivCollect() {
  }

  formatDate(date: string) {
    if (!date) {
      return '';
    }

    const annee  = date.slice(0, 4);
    const mois   = date.slice(4, 6);
    const jour   = date.slice(6, 8);
    const heure  = date.slice(8, 10);
    const minute = date.slice(10, 12);

    return jour + '/' + mois + '/' + annee + ' ' + heure + ':' + minute;
  }

  reset() {
    this.campagnes = [];
    this.detailsCampagne = [];
    this.campagneControl.setValue('');
    this.initiePercent  = 0;
    this.partielPercent = 0;
    this.validePercent  = 0;
    this.echecPercent   = 0;
    this.initieMontantPercent  = 0;
    this.partielMontantPercent = 0;
    this.valideMontantPercent  = 0;
    this.echecMontantPercent   = 0;

    this.nbInitie     = 0;
    this.nbPartiel    = 0;
    this.nbValide     = 0;
    this.nbEchoue     = 0;
    this.nbBloque     = 0;
    this.total        = 0;
    this.montantPaye  = '0';
    this.montantTotal = '0';
    this.selectedCampagne = null;
  }

  getPartenaireMouvements() {
    const dialogRef = this.dialog.open(PartenaireMouvementComponent, {
      width: '1200px',
      data: {
            isDialog: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && !result.canceled) {
      }
    });
  }

  onKey(value: any) {
      console.log(value);
      if (value === '' || value === null) {
          this.filteredCampagnes = this.campagnes;
      } else {
          this.filteredCampagnes = this.campagnes.filter(campagne => campagne.nom.toLowerCase().indexOf(value.toLowerCase()) !== -1 );
      }
      console.log(this.filteredCampagnes);
  }

}
