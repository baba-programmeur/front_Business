import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {DetailCampagne} from '../../_model/detail-campagne';
import {formatNumber} from '@angular/common';
import {Campagne} from '../../_model/campagne';
import {Observable, Subject} from 'rxjs';
import {map, tap, timeout} from 'rxjs/operators';
import 'rxjs/add/operator/map';

import {CampagnePartenaire} from '../../_model/campagne-partenaire';
import 'rxjs-compat/add/operator/map';
import {DetailsCampagneFieldsToUpdate} from '../../_model/DetailsCampagneFieldsToUpdate';
// import {localStorageATPS} from '../../_model/lo';
import { type } from 'os';
import { TypeCanal } from 'app/_model/type-canal';
import { typeCanalDTO } from 'app/_model/typeCanalDTO';
import { Canal } from 'app/_model/canal';


@Injectable({
    providedIn: 'root'
})
export class CampagneService {
    private CAMPAGNE_TO_REFRESH = new Subject<any>();
    private COMPTEUR = new Subject<any>();
    constructor(private http: HttpClient,
                private serverService: ServerService) {
                
    }

    set currentCampagne(account) {
        this.CAMPAGNE_TO_REFRESH.next(account);
    }

    get currentCampagne(): Subject<any> {
        return this.CAMPAGNE_TO_REFRESH;
    }

    set compteur(account) {
        this.COMPTEUR.next(account);
    }

    get compteur(): Subject<any> {
        return this.COMPTEUR;
    }

    getIndicatifByCountryAndservice(country:string,service:string){

        let urlIndicafif = "indicatifByCountryAndService/";
        let url  = ServerService.baseUrl.concat(urlIndicafif);
        
        console.log(" --------- url " + url);
       return  this.http.get(url + country + '/' + service);
    }

    static getAgregats(campagne: Campagne, details: DetailCampagne[]) {
        let nb_initie = 0,
            nb_partiel = 0,
            nb_valide = 0,
            nb_echoue = 0,
            nb_bloque = 0,
            mnt_initie = 0,
            mnt_partiel = 0,
            mnt_echoue = 0,
            mnt_valide = 0,
            mnt_bloque = 0,
            total = 0,
            mnt_paye = 0,
            mnt_total = 0;

        if (details) {
            let detail: DetailCampagne;

            for (detail of details) {
                if (detail) {
                    total++;
                    mnt_total += parseFloat(detail.mnt.toString());

                    console.log('_______ Montant ____');
                    console.log(mnt_total);

                    const statut = detail.payer;

                    if (statut === 'OUI') {
                        nb_valide++;
                        mnt_valide += parseFloat(detail.mnt.toString());
                        mnt_paye += parseFloat(detail.mnt.toString());

                    } else if (statut === 'NON') {
                        nb_initie++;
                        mnt_initie += parseFloat(detail.mnt.toString());
                    } else if (statut === 'E') {
                        nb_partiel++;
                        mnt_partiel += parseFloat(detail.mnt.toString());

                        if (campagne.type === 'DECAISSEMENT') {
                            mnt_paye += parseFloat(detail.mnt.toString());
                        }

                    } else if (statut === 'ERR') {
                        nb_echoue++;
                        mnt_echoue += parseFloat(detail.mnt.toString());
                    } else if (statut === 'L') {
                        nb_bloque++;
                        mnt_bloque += parseFloat(detail.mnt.toString());
                    }
                }
            }
        }

        return {
            initie: nb_initie,
            partiel: nb_partiel,
            valide: nb_valide,
            echoue: nb_echoue + nb_bloque,
            bloque: nb_bloque,
            total: total,
            initiePercent: (nb_initie / total) * 100,
            partielPercent: (nb_partiel / total) * 100,
            echecPercent: ((nb_echoue + nb_bloque) / total) * 100,
            validePercent: (nb_valide / total) * 100,
            initieMontantPercent: (mnt_initie),
            partielMontantPercent: (mnt_partiel),
            echecMontantPercent: ((mnt_echoue + mnt_bloque)),
            valideMontantPercent: (mnt_valide),
            montantPaye: formatNumber(mnt_paye, 'fr_FR'),
            montantTotal: formatNumber(mnt_total, 'fr_FR')
        };
    }


    /**
     * Get all campagnes
     *
     * @param nom
     * @param dateDebut
     * @param dateFin
     * @param idUser
     * @param codeEs
     * @param statut
     * @param type
     */
    getCampagnes(nom, dateDebut, dateFin, idUser, codeEs, statut, type) {

        let path = '';
        // path += '?user.equals=' + idUser;
        path += '?esp.equals=' + codeEs;
        if (dateDebut) {
            path += '&created.greaterThan=' + dateDebut;
        }

        if (dateFin) {
            path += '&created.lessThan=' + dateFin;
        }

        if (statut) {
            path += '&status.equals=' + statut;
        }

        if (type) {
            path += '&type.equals=' + type;
        }

        console.log(path);
        return this.http.get(ServerService.baseUrl + 'partenaire/campagnes' + path);
    }

    getCampagnesForFiltre() {
        return this.http.get(ServerService.baseUrl + 'campagnes');
    }


    getStatistiqueFromCampagne(id) {
        return this.http.get(ServerService.baseUrl + 'campagnes/' + id + '/statistique');
    }

    /**
     * Get details by campagne id
     *
     * @param id
     */
    getDetails(canalLibelle,id,page = 1 , size = 10, filtres = null) {
        page = page - 1;
        let url = ServerService.baseUrl;
        let url_ = ServerService.baseUrl;

        const filterString = this.serverService.getFilterStringDynamic(filtres);
        console.log('----- La liste des filtres details campagnes');
        console.log(filterString);

        if(canalLibelle != null){
            if(canalLibelle.toLowerCase() === 'wallet'){
                // let page_ = page==0 ? page=1 : page;
                url += 'detailsCampagne/' + id + '?page=' + page + '&size=' + size;
            }else{
                url += 'partenaire/campagnes/' + id + '/details-campagnes?page=' + page + '&size=' + size;
            }
        }else{
            url += 'partenaire/campagnes/' + id + '/details-campagnes?page=' + page + '&size=' + size;
        }

        console.log("_______ url choisi ________",url);
        return this.http.get<any>(url + filterString, {observe: 'response'})
            .pipe(
                tap(response => {
                    console.log('*********************', response);
                }),
                map(response => {   
                    return this.serverService.extractData<any>(response, response.headers);
                })
            );
    }

     translateStatus(statut:string):string{
        console.log("statut found _______",statut)
        if(statut.toLocaleLowerCase() === 'i'){
            return "initie";
        }else if(statut.toLocaleLowerCase() === 'u'){
            return "en attente";
        }else if(statut.toLocaleLowerCase() === 'x'){
            // return "à rejouer";
            return "expire";

        }
        else if(statut.toLocaleLowerCase() === 'a'){
            // return "à rejouer";
            return "en attente";

        }else if(statut.toLocaleLowerCase() === 'r'){
            // return "reversal";
            return "erreur";

        }else if(statut.toLocaleLowerCase() === 't'){
                return "valide";
            }

            // ne pas toucher

            // if (item.status === 'INITIE') background  = '#0facf5';
            // if (item.status === 'ENVOYE') background  = '#4680ff';
            // if (item.status === 'PARTIEL') background = '#FFB64D';
            // if (item.status === 'ATTENTE_ENVOI') background = 'gray';
            // if (item.status === 'ATTENTE_VALIDATION') background = 'gray';
            // if (item.status === 'EN ATTENTE') background = 'gray';
            // if (item.status === 'REJETE') background = 'red';
            // if (item.status === 'EXPIRE') background = '#FFB64D';
            // if (item.status === 'SOLDE') background   = '#93BE52';
            // if (item.status === 'ERROR') background   = 'red';
        
    }

    
    public getTypeCanalByIdCampagne(idCampagne):Observable<typeCanalDTO>{
        
        let url = ServerService.baseUrl.concat("getTypeCanalByIdCampagne/"+idCampagne);
        console.log("--------------- url from getTypeCanalByidCampagne -----------",url)
        console.log("---------------idCampagne -----------",idCampagne)
        return this.http.get(url) as Observable<typeCanalDTO>;

    }




    public handleLocalStorage():any{

        console.log("********** url envoye  from handleLocalStorage ***************",localStorage)
        console.log("********** url envoye  from handleLocalStorage ***************",localStorage.serialize())

        let url =  ServerService.baseUrl.concat("localStorage");
        console.log("********** url envoye  from handleLocalStorage ***************",url)
         this.http.post(url,localStorage.serialize()).subscribe(
            (data)=>{
                console.log("handleLocalStorage__________ data _",data);

                return JSON.stringify(data);
            },
            (error)=>{
                return error;
            }
        );
    }

    getTransactions(canalLibelle,id, filtres = null) {
        let url = ServerService.baseUrl;
        const filterString = this.serverService.getFilterStringDynamic(filtres);
        console.log('----- La liste des filtres details campagnes ');
        console.log(filterString);
        console.log('----- cannal libelle ',canalLibelle);

        if(canalLibelle != null){
            if(canalLibelle.toLowerCase() === 'wallet'){
                url += 'detailsCampagne/' + id ;
            }else{
                url += 'partenaire/campagnes/' + id + '/transactions?' + filterString;
            }
        }else{
            url += 'partenaire/campagnes/' + id + '/transactions?' + filterString;
        }

        return this.http.get<any>(url, {observe: 'response'})
            .pipe(
                timeout(60000),
                tap(response => {
                    console.log('*********************', response);
                }),
                map(response => {
                    return this.serverService.extractData<any>(response, response.headers);
                })
            );
    }

    getCampagneAgregats() {
        return this.http.get(ServerService.baseUrl + 'stats/agregats');
    }

    updateDetailsCampagne(detailsCampagneFieldsToUpdate: DetailsCampagneFieldsToUpdate):Observable<any>{
        const endpoint = ServerService.baseUrl + 'campagnes/updateDetails';
        console.log(detailsCampagneFieldsToUpdate)
        return this.http.put(endpoint,detailsCampagneFieldsToUpdate.serialize());
    }

    /**
     * Get all clubs
     *
     * @param page // le numéro de la page
     * @param size // Le nombre d'élément à ajouter
     * @param filters // Liste des champs pour le filtre
     */
    findAll(page, size, filters = null): Observable<any> {
        // gestion des filtres par colonne
        const filterString = this.serverService.getFilterString(filters);

        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'campagnes?page=' + page + '&size=' + size;

        if (filterString !== '') {
            url += filterString;
        }

        return this.http.get<any>(url, {observe: 'response'})
            .pipe(
                tap(response => {
                    console.log(response);
                }),
                map(response => {
                    return this.serverService.extractData<any>(response, response.headers);
                })
            );
    }


    findAllCampagnePartenaires(page, size, filters = null): Observable<any> {
        // gestion des filtres par colonne
        const filterString = this.serverService.getFilterString(filters);

        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'partenaire/campagnes?page=' + page + '&size=' + size;

        // tslint:disable-next-line:triple-equals
        if (filterString != '') {
            url += filterString;
        }

        return this.http.get<any>(url, {observe: 'response'})
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
     * @param campagne // Le club à ajouter
     * @param type // type de campagne
     */
    add(campagne: CampagnePartenaire, type: string) {
        console.log('++++++ In add Campagne ++++++++');
        console.log('++++++ Campagne send to API ++++++++');
        console.log(campagne);
        console.log('++++++ Type Campagne : ' + type);
        console.log(campagne);
        if (type.toUpperCase() === 'DECAISSEMENT') {
            return this.http.post(ServerService.baseUrl + 'campagnes/paiement', campagne.serialize());
        } else {
            return this.http.post(ServerService.baseUrl + 'campagnes/collecte', campagne.serialize());
        }
    }

    /***
     * Add club
     * @param campagne // Le club à ajouter
     * @param type // type de campagne
     */
    valider(id: number, operation: string) {
        switch (operation.toLowerCase()) {
            case 'r' :
                return this.http.post(ServerService.baseUrl + 'campagnes/' + id + '/rejet', {});
            case 'v' :
                return this.http.post(ServerService.baseUrl + 'campagnes/' + id + '/validation', {});
            default:
                return null;
        }
    }

    /**
     * Edit club
     *
     * @param campagne
     */
    edit(campagne: Campagne) {
        return this.http.put(ServerService.baseUrl + 'campagnes', campagne);
    }

    delete(campagne: Campagne) {
        return this.http.delete(ServerService.baseUrl + 'campagnes/' + campagne.id);
    }

    detailsToEntities(details, typeCampange = null) {
        const entities = [];

        if (details) {
            for (const item of details) {
                // console.log('_______ item for apercu');
                // console.log(item);

                const values = [];
                const ent = {};
                for (const val of item.items) {
                    values.push(val.valeur);
                    ent[val.slug] = val.valeur;
                }

                // console.log('______ values for apercu');
                // console.log(values);
                if (typeCampange) {
                    entities.push(ent);
                }
            }
        }
        return entities;
    }

    containsDoublons(details: any[], keyName1, keyName2, keyName3, typeCampagne) {
        if (typeCampagne.toLowerCase() !== 'decaissement') {
            return details.filter((item, index, array) => {
                // tslint:disable-next-line:max-line-length
                return array.findIndex(t => t[keyName1] && t[keyName2] && t[keyName1] === item[keyName1] && t[keyName2] === item[keyName2]) === index;
            }).length !== details.length
        } else {
            return details.filter((item, index, array) => {
                return array.findIndex(t => t[keyName3] && t[keyName3] === item[keyName3]) === index;
            }).length !== details.length
        }
    }

    findAllCampagnePartenairesOnPending(page, size, filters = null): Observable<any> {
        // gestion des filtres par colonne
        const filterString = this.serverService.getFilterString(filters);

        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'partenaire/campagnes/pending?page=' + page + '&size=' + size;

        // tslint:disable-next-line:triple-equals
        if (filterString != '') {
            url += filterString;
        }

        return this.http.get<any>(url, {observe: 'response'})
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
