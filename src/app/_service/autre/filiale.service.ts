import {Filiale} from '../../_model/filiale';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from '../auth/server.service';

@Injectable({
    providedIn: 'root'
})
export class FilialeService {

    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    /**
     * Get all filiales
     */
    getFiliales() {
        return this.http.get(ServerService.baseUrl + 'filiales?page=0&size=10000000');
    }

    getFilialesByEntite(entiteId) {
        return this.http.get(ServerService.baseUrl + 'filiales/' + entiteId + '/entite');
    }

    /**
     * Find filiale by id
     *
     * @param filialeId
     */
    findById(filialeId) {
        return this.http.get(ServerService.baseUrl + 'filiales/' + filialeId);
    }

    /**
     * Find filiale by code
     *
     * @param code
     */
    findByCode(code) {
        return this.http.get(ServerService.baseUrl + 'filiales?codees.equals=' + code);
    }

    findFiliale() {
        return this.http.get(ServerService.baseUrl + 'filiales/by-user');
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
        url += 'filiales';

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
     * @param filiale // La filiale à ajouter
     */
    add(filiale: Filiale) {
        return this.http.post(ServerService.baseUrl + 'filiales', filiale.serialize());
    }

    /**
     * Edit club
     *
     * @param campagne
     */
    edit(filiale: Filiale) {
        return this.http.put(ServerService.baseUrl + 'filiales', filiale);
    }


    delete(filiale: Filiale) {
        return this.http.delete(ServerService.baseUrl + 'filiales/' + filiale.id);
    }
}
