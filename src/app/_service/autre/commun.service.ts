import {ServerService} from '../auth/server.service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import DateTimeFormat = Intl.DateTimeFormat;
import any = jasmine.any;
import * as XLSX from 'xlsx';
import {LoaderService} from '../auth/loader.service';
import { CampagneService } from './campagne.service';

declare var swal;

@Injectable({
    providedIn: 'root'
})
export class CommunService {

    constructor(
        private http: HttpClient,
        private loaderService: LoaderService,
        private campagneService: CampagneService) {
    }

    static completeTwo(value: number) {
        if (value < 10) {
            return '0' + value;
        } else {
            return value;
        }
    }

    static myDateFormat(date: Date, tag = 'debut') {
        let dateFormated = '';

        dateFormated += date.getFullYear();
        dateFormated += '-' + CommunService.completeTwo(date.getMonth() + 1);
        dateFormated +=  '-' + CommunService.completeTwo(date.getUTCDate());

        console.log('Date selectionner : ', dateFormated);

        if (tag === 'debut') {
            dateFormated += 'T00:00:00Z';
        } else if (tag === 'fin') {
            dateFormated += 'T23:59:59Z';
        }
        return dateFormated;
    }

    static myDateFormat1(date: Date, tag = 'debut') {
        let dateFormated = '';

        dateFormated +=  CommunService.completeTwo(date.getUTCDate());
        dateFormated += '-' + CommunService.completeTwo(date.getMonth() + 1);
        dateFormated += '-' + date.getFullYear();

        console.log('Date selectionner : ', dateFormated);

        if (tag === 'debut') {
            dateFormated += 'T00:00:00Z';
        } else if (tag === 'fin') {
            dateFormated += 'T23:59:59Z';
        }
        return dateFormated;
    }

    static getPeriode(tag) {
        let dateDebut;
        let dateFin;

        switch (tag) {
            case 'today':
                const date = new Date();
                dateDebut = CommunService.myDateFormat(date);
                dateFin   = CommunService.myDateFormat(date, 'fin');
                break;
            case 'yesterday':
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                dateDebut = CommunService.myDateFormat(yesterday);
                dateFin   = CommunService.myDateFormat(yesterday, 'fin');
                break;
            case 'thisWeek':
                const date2 = new Date; // get current date
                const first = date2.getDate() - date2.getDay() + 1; // First day is the day of the month - the day of the week
                const last = first + 6; // last day is the first day + 6

                const firstday1 = new Date(date2.setDate(first));
                const lastday1  = new Date(date2.setDate(last));

                dateDebut = CommunService.myDateFormat(firstday1);
                dateFin   = CommunService.myDateFormat(lastday1, 'fin');
                break;
            case 'previousWeek':
                const beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
                    , day = beforeOneWeek.getDay()
                    , diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
                    , lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
                    , lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));

                dateDebut = CommunService.myDateFormat(lastMonday);
                dateFin   = CommunService.myDateFormat(lastSunday, 'fin');
                break;
            case 'thisMonth':
                const date5 = new Date();
                const firstDay = new Date(date5.getFullYear(), date5.getMonth(), 1);
                const lastDay = new Date(date5.getFullYear(), date5.getMonth() + 1, 0);

                dateDebut = CommunService.myDateFormat(firstDay);
                dateFin   = CommunService.myDateFormat(lastDay, 'fin');
                break;
            case 'previousMonth':
                const now = new Date();
                const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const lastDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

                dateDebut = CommunService.myDateFormat(firstDayPrevMonth);
                dateFin   = CommunService.myDateFormat(lastDayPrevMonth, 'fin');
                break;
            case 'thisYear':
                const firstOfYear = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0);
                const lastOfYear  = new Date(new Date().getFullYear(), 11, 31, 0, 0, 0);

                dateDebut = CommunService.myDateFormat(firstOfYear);
                dateFin   = CommunService.myDateFormat(lastOfYear, 'fin');
                break;
            default:
                break;
        }

        return {
            dateDebut: dateDebut,
            dateFin: dateFin
        };
    }


    getStatutsCampagne() {
        return this.http.get(ServerService.baseUrl + 'filtres/campagnes/statuts');
    }

    getStatutsDetailsCampagne() {
        return this.http.get(ServerService.baseUrl + 'filtres/details-campagnes/statuts');
    }

    getCodePartenaires() {
        return this.http.get(ServerService.baseUrl + 'filtres/code-partenaires');
    }

    static calculerFraisCampagne(montant: string, profilFraisCourant): number {
        if (profilFraisCourant != null) {
            switch (profilFraisCourant.profilFrais.type) {
                case 'plage':
                    for (const plage of profilFraisCourant.plages) {
                        if (+montant >= +plage.min && +montant <= +plage.max) {
                            return +plage.montant;
                        }
                    }
                    return 0.0;
                case 'pourcentage':
                    return (+montant) * (+profilFraisCourant.profilFrais.valeur);
                case 'fixe':
                    return (+profilFraisCourant.profilFrais.valeur);
                default:
                    return 0.0;
            }
        } else {
            return 0.0;
        }
    }

    getCodePartenairesWithIdsSouscription() {
        return this.http.get(ServerService.baseUrl + 'filtres/code-partenaires-with-ids');
    }

    getPays() {
        return this.http.get(ServerService.baseUrl + 'filtres/pays');
    }

    getTypeComptes() {
        return this.http.get(ServerService.baseUrl + 'filtres/type-comptes');
    }

    getRole(authorities: any[]) {
        if (!authorities || authorities.length === 0) {
            return '';
        } else if (authorities) {
            if (authorities.length === 1) {
                return authorities[0];
            } else {
                return authorities[1];
            }
        }
    }

    exporter(entities: any[], title) {
        let head = [];
        console.log('Les donnees à exporter sous excel');
        console.log(entities);
        if (entities) {
            head = Object.keys(entities[0].object);

    
            let object = entities[0].object;

            let typeCanal =  object.typeCanal ? object.typeCanal : "no_wallet";
           
            if(typeCanal.toLowerCase() === 'wallet'){

              head[0]='idclient';
              head[1]='telephone';
              head[2]='montant';
              head[3]='frais';
              head[4]='Date creation';
              head[5]='prenom';
              head[6]='nom';
              head[7]='email';
              head[8]='canal';
              head[9]='sous_canal';
              head[10]='type_piece';
            //   head[11]='numero_piece';
              head[12]='statut';
            //   head[13]='motif';
              head[14]='commentaire';
            //   head[15]='notif_email';
            //   head[16]='notif_sms';
              head[17]='code';
              head[18]='echeance';

            }else{

              head[0]='idclient';
              head[1]='telephone';
              head[2]='montant';
              head[3]='frais';
              head[4]='Date_Campagne';
              head[5]='prenom';
              head[6]='nom';
              head[7]='email';
              head[8]='canal';
              head[9]='Sous canal';
              head[10]='type_piece';
              head[11]='numero_piece';
              head[12]='statut';
              head[13]='motif';
              head[14]='commentaire';
              head[15]='notif_email';
              head[16]='notif_sms';
              head[17]='code';
              head[18]='echeance';

            }

            this.loaderService.show();

            const tabEnt = [];
            let o: any;
            for (const e of entities) {
                o = {};
                console.log("head ___",head);
                for (const i of head) {
                    // tslint:disable-next-line:max-line-length
                    if (i.toLowerCase() !== 'txtsms' && i.toLowerCase() !== 'fichier' && i.toLowerCase() !== 'fichieroriginal' && i.toLowerCase() !== 'partner' && i.toLowerCase() !== 'user'
                        && i.toLowerCase() !== 'mois' && i.toLowerCase() !== 'fraisid' && i.toLowerCase() !== 'entity'
                        && i.toLowerCase() !=='heure_envoi' && i.toLowerCase() !=='date_envoi' && i.toLowerCase() !=='date') {

                        if (i.toLowerCase() === 'esp') {
                            o['PARTENAIRE'] = e.object[i];
                        }
                        else if(i.toLowerCase() === 'sous_canal'){
                            o[i.toUpperCase()] = e.object.typeCanal;
                        }else if(i.toLowerCase() === 'statut' && typeCanal.toLowerCase() === 'wallet'){
                           let statut = this.campagneService.translateStatus(e.object.statut)
                           o[i.toUpperCase()] = statut;
                        }else if(i.toLowerCase() === 'date creation'){
                            o[i.toUpperCase()] = e.object.date;
                         }
                        else {
                            o[i.toUpperCase()] = e.object[i];
                        }
                    }
                }
                tabEnt.push(o);
                console.log("tableau",tabEnt);
            }
            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tabEnt);
            const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
            setTimeout(() => {
                XLSX.writeFile(workbook, 'export - ' + title + '-' + (new Date()).getTime() + '.xlsx', {bookType: 'xlsx', type: 'binary'});
                this.loaderService.hide()
            }, 2000);
        } else {
            swal({
                text: 'Il n\'y as pas de données',
                icon: 'error'
            })
        }
    }

}
