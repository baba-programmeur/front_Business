import { ChampValidation } from '../../_model/champ-validation';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from '../auth/server.service';

@Injectable({
    providedIn: 'root'
})
export class ChampValidationService {

    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    /**
     * Get all champValidations
     */
        getChampValidations() {
        return this.http.get(ServerService.baseUrl + 'champValidations');
    }

    /**
     * Find champValidation by id
     *
     * @param champValidationId
     */
    findById(champValidationId) {
        return this.http.get(ServerService.baseUrl + 'champ-validations/' + champValidationId);
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
        url += 'champ-validations';

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
     * @param champValidation //
     */
    add(champValidation: ChampValidation) {
        return this.http.post(ServerService.baseUrl + 'champ-validations', champValidation.serialize());
    }

    /**
     * Edit club
     *
     * @param champValidation
     */
    edit(champValidation: ChampValidation) {
        return this.http.put(ServerService.baseUrl + 'champ-validations', champValidation);
    }


    delete(champValidation: ChampValidation) {
        return this.http.delete(ServerService.baseUrl + 'champ-validations/' + champValidation.id);
    }
}
