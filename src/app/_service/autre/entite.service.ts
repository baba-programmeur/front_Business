import {Entite} from './../../_model/entite';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {FormulaireData} from '../../_model/formulaire-data';
import {FormulaireItemData} from '../../_model/formulaire-item-data';

@Injectable({
    providedIn: 'root'
})
export class EntiteService {

    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    /**
     * Get all entites
     */
    getEntites() {
        return this.http.get(ServerService.baseUrl + 'entites?page=0&size=10000000');
    }

    /**
     * Find entite by id
     *
     * @param entiteId
     */
    findById(entiteId) {
        return this.http.get(ServerService.baseUrl + 'entites/' + entiteId);
    }

    /**
     * Find entite by code
     *
     * @param code
     */
    findByCode(code) {
        return this.http.get(ServerService.baseUrl + 'entites?codees.equals=' + code);
    }

    findEntite() {
        return this.http.get(ServerService.baseUrl + 'entites/by-user');
    }



    /**
     * Get all clubs
     *
     * @param page // le numéro de la page
     * @param size // Le nombre d'élément à ajouter
     * @param filtres // liste filtre
     */
    findAll(page, size, filtres = null): Observable<any> {
        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'entites';

        const filtresString = this.serverService.getFilterString(filtres);

        return this.http.get<any>(url + '?page=' + page + '&size=' + size + filtresString, {observe: 'response'})
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
     * @param entite // La entite à ajouter
     */
    add(entite: Entite) {
        return this.http.post(ServerService.baseUrl + 'entites', entite.serialize());
    }

    /**
     * Edit club
     *
     * @param campagne
     */
    edit(entite: Entite) {
        return this.http.put(ServerService.baseUrl + 'entites', entite);
    }

    /**
     * Edit club
     *
     * @param campagne
     */
    active(entite: Entite) {
        return this.http.put(ServerService.baseUrl + 'entites/active', entite);
    }


    delete(entite: Entite) {
        return this.http.delete(ServerService.baseUrl + 'entites/' + entite.id);
    }
}
