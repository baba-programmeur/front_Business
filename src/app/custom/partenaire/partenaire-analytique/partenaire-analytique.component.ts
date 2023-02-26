import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ParameterService} from '../../../_service/autre/parameter.service';
import {CampagneService} from '../../../_service/autre/campagne.service';
import {LoaderService} from '../../../_service/auth/loader.service';
import {NotificationService} from '../../../_service/autre/notification.service';
import {CommunService} from '../../../_service/autre/commun.service';

const defaut_type = '';
const default_statut = '';
const default_periode = 'thisMonth';

@Component({
  selector: 'app-partenaire-analytique',
  templateUrl: './partenaire-analytique.component.html',
  styleUrls: ['./partenaire-analytique.component.scss']
})
export class PartenaireAnalytiqueComponent implements OnInit, OnChanges {
  dateDebut;
  dateFin;
  statut;
  type;

  statutControl   = new FormControl(default_statut);
  typeControl     = new FormControl(defaut_type);
  periodeControl  = new FormControl(default_periode);

  nbInitie              = 0;
  nbPartiel             = 0;
  nbValide              = 0;
  nbEchoue              = 0;
  nbBloque              = 0;
  total                 = 0;
  initiePercent         = 0;
  partielPercent        = 0;
  validePercent         = 0;
  echecPercent          = 0;

  initieMontantPercent  = 0;
  partielMontantPercent = 0;
  valideMontantPercent  = 0;
  echecMontantPercent   = 0;

  montantPaye           = '0';
  montantTotal          = '0';
  montantInitie         = '0';
  montantPartiel        = '0';
  montantSolde          = '0';
  montantEchoue         = '0';
  montantBloque         = '0';

  chartCampagneStatutWidth = 1000;
  campagneStatutArray = [[]];

  constructor(private parameterService: ParameterService,
              private campagneService: CampagneService,
              private loaderService: LoaderService,
              private notificationService: NotificationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log ('____ DATA CHANGE');
    console.log(changes);
  }

  ngOnInit() {
    this.parameterService.screenWidth.subscribe(
        value => {
          if (value <= 320) {
            this.chartCampagneStatutWidth = 300;
          } else if (value > 320 && value <= 425) {
            this.chartCampagneStatutWidth = 400;
          } else if (value > 425 && value <= 768) {
            this.chartCampagneStatutWidth = 600;
          } else if (value > 768 && value <= 1024) {
            this.chartCampagneStatutWidth = 700;
          } else if (value > 1024) {
            this.chartCampagneStatutWidth = 1000;
          }
        }
    );
    //
    // this.notificationService.pushData
    //     .subscribe(
    //         (data) => {
    //           console.log('_____ DATA FROM PAYMENT');
    //           console.log(data);
    //
    //           if (data && data.type === 'analytique') {
    //             this.total        = data.total;
    //             this.nbInitie     = data.initie;
    //             this.nbPartiel    = data.partiel;
    //             this.nbValide     = data.solde;
    //             this.nbBloque     = data.bloque;
    //             this.nbEchoue     = data.echec;
    //
    //             const mntPaye  = +data.montantPaye;
    //             const mntTotal = +data.montantTotal;
    //
    //             this.montantPaye  = mntPaye.toLocaleString('fr-FR');
    //             this.montantTotal = mntTotal.toLocaleString('fr-FR');
    //           }
    //     });

    this.campagneService.getCampagneAgregats().subscribe(
        (data: any) => {
          console.log('_____ Campagne agregats');
          console.log(data);

          if (data && data.type === 'analytique') {
            this.total        = data.total;
            this.nbInitie     = data.initie;
            this.nbPartiel    = data.partiel;
            this.nbValide     = data.solde;
            this.nbBloque     = data.bloque;
            this.nbEchoue     = data.echoue;

            const mntTotal   = +data.montantTotal;
            const mntInitie  = +data.montantInitie;
            const mntPartiel = +data.montantPartiel;
            const mntSolde   = +data.montantSolde;
            const mntEchoue  = +data.montantEchoue;
            const mntBloque  = +data.montantBloque;

            const mntPaye    = mntSolde + mntPartiel;

            this.montantPaye    = mntPaye.toLocaleString('fr-FR');
            this.montantTotal   = mntTotal.toLocaleString('fr-FR');

            this.montantInitie  = data.montantInitie;
            this.montantPartiel = data.montantPartiel;
            this.montantSolde   = data.montantSolde;
            this.montantEchoue  = data.montantEchoue;
            this.montantBloque  = data.montantEchoue;

            if (this.total != 0) {
              this.initiePercent  = (this.nbInitie * 100) / this.total;
              this.partielPercent = (this.nbPartiel * 100) / this.total;
              this.validePercent  = (this.nbValide * 100) / this.total;
              this.echecPercent   = (this.nbEchoue * 100) / this.total;
            }

            if (mntTotal != 0) {
              this.initieMontantPercent  = (mntInitie * 100) / mntTotal;
              this.partielMontantPercent = (mntPartiel * 100) / mntTotal;
              this.valideMontantPercent  = (mntSolde * 100) / mntTotal;
              this.echecMontantPercent   = ((mntEchoue + mntBloque) * 100) / mntTotal;
            }

            console.log('__ % initie : ', this.initieMontantPercent);
            console.log('__ % partiel : ', this.partielMontantPercent);
            console.log('__ % solde : ', this.valideMontantPercent);
            console.log('__ % echec : ', this.echecMontantPercent);

            const campagnes = data.campagnes;
            if (campagnes) {
              this.campagneStatutArray = [];

              for (const campagne of campagnes) {
                this.campagneStatutArray.push([campagne.nom, campagne.initie, campagne.partiel, campagne.solde, campagne.echec])
              }
            }
          }
        }
    );
  }


  onSelectPeriode(event) {
    console.log('____ Periode _____');
    console.log(event.value);

    const value = event.value;

    this.periodeControl.setValue(value);
    const periode = CommunService.getPeriode(value);
    console.log(periode);

    this.dateDebut = periode.dateDebut;
    this.dateFin   = periode.dateFin;

    // this.getCampagnes();
  }

  onSelectType(event) {
    console.log('____type _____');
    console.log(event.value);

    this.typeControl.setValue(event.value);
    this.type = event.value;

    // this.getCampagnes();
  }

  onSelectStatut(event) {
    console.log('____type _____');
    console.log(event.value);

    this.statutControl.setValue(event.value);
    this.statut = event.value;
    // this.getCampagnes();
  }

}
