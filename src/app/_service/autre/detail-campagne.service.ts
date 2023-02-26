import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {DetailCampagne} from '../../_model/detail-campagne';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DetailCampagneService {
    constructor(private http: HttpClient,
                private serverService: ServerService) { }

    /**
     * Get all clubs
     *
     * @param page // le numéro de la page
     * @param size // Le nombre d'élément à ajouter
     * @param campagne
     * @param filtres
     */
    findAll(page, size, campagne, filtres = null): Observable<any> {
        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'details-campagnes';

        let filtreString = this.serverService.getFilterString(filtres);

        if (campagne) {
            filtreString += '&referenceId.equals=' + campagne.id
        }

        return this.http.get<any>(url + '?page=' + page + '&size=' + size + filtreString , {observe: 'response'})
            .pipe(
                tap(response => {
                    console.log(response);
                }),
                map(response => {
                    return this.serverService.extractData<any>(response, response.headers);
                })
            );
    }


    /***
     * Add club
     *
     * @param detail // Le club à ajouter
     */
    add(detail: DetailCampagne) {
        return this.http.post(ServerService.baseUrl + 'details-campagnes', detail.serialize());
    }

    /**
     * Edit club
     *
     * @param detail
     */
    edit(detail: DetailCampagne) {
        return this.http.put(ServerService.baseUrl + 'details-campagnes', detail);
    }

    /**
     * Edit club
     *
     * @param detail
     */
    editDetail(detail: DetailCampagne) {
        return this.http.put(ServerService.baseUrl + 'partenaire/details-campagnes', detail);
    }

    /**
     * Edit club
     *
     * @param detail
     */
    sendCode(detail: DetailCampagne) {
        return this.http.put(ServerService.baseUrl + 'partenaire/details-campagnes/send-code', detail);
    }

    delete(detail: DetailCampagne) {
        return this.http.delete(ServerService.baseUrl + 'details-campagnes/' + detail.id);
    }

    upDate(detail:DetailCampagne):Observable<any>{

        return this.http.put<any>(ServerService.baseUrl + 'details-campagnes',detail);
    }

    filterDetails(details, filters) {
        let filteredDetails = [];

        if (filters) {
            if (details) {
                for (let detail of details) {
                    if (DetailCampagneService.detailInFilters(detail, filters)) {
                        filteredDetails.push(detail);
                    }
                }
            }
        }

        return filteredDetails;
    }

    private static detailInFilters(detail, filters) {
        if (filters) {
            for (let filter of filters) {
                let value: string = DetailCampagneService.getValueForFilter(detail, filter.tag);
                if (value) {
                    value = value.toString().toLowerCase();
                }

                let filterValue = "";
                if (filter.value) {
                    filterValue = filter.value.toLowerCase();
                }

                switch (filter.type) {
                    case 'equals':
                        if (filterValue === value) {
                            return true;
                        }
                        break;
                    case 'in':
                        let arr = filterValue.split(',');
                        if (arr) {
                            for (let item of arr) {
                                if (item === value) {
                                    return true;
                                }
                            }
                        }
                        break;
                    case 'contains':
                        if (value.includes(filterValue)) {
                            return true;
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        return false;
    }

    private static getValueForFilter(detail: DetailCampagne, tag) {
        if (!detail) {
            return "";
        }

        switch (tag) {
            case 'bank':
                return detail.bank;
            case 'canal':
                return detail.canal;
            case 'code':
                return detail.code;
            case 'com':
                return detail.com;
            case 'datePaiement':
                return detail.datePaiement;
            case 'dateenvoi':
                return detail.dateenvoi;
            case 'ech':
                return detail.ech;
            case 'errorMessage':
                return detail.errorMessage;
            case 'esp':
                return detail.esp;
            case 'heureenvoi':
                return detail.heureenvoi;
            case 'id':
                return detail.id.toString();
            case 'idclt':
                return detail.idclt;
            case 'idfct':
                return detail.idfct;
            case 'mailclt':
                return detail.mailclt;
            case 'mnt':
                return detail.mnt;
            case 'motif':
                return detail.motif;
            case 'nbsms':
                return detail.nbsms.toString();
            case 'nomclt':
                return detail.nomclt;
            case 'numeroCompte':
                return detail.numeroCompte;
            case 'numeroPiece':
                return detail.numeroPiece;
            case 'partner':
                return detail.partner;
            case 'payer':
                return detail.payer;
            case 'pays':
                return detail.pays;
            case 'paysIdId':
                return detail.paysIdId.toString();
            case 'prenomclt':
                return detail.prenomclt;
            case 'referenceId':
                return detail.referenceId.toString();
            case 'supporterFrais':
                return detail.supporterFrais;
            case 'telclt':
                return detail.telclt;
            case 'txtsms':
                return detail.txtsms;
            case 'typeCanal':
                return detail.typeCanal;
            case 'typePiece':
                return detail.typePiece;
            case 'typeclt':
                return detail.typeclt;
            case 'verser':
                return detail.verser;
            default:
                break;
        }
    }
}
