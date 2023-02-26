import {Champ} from './../../_model/champ';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from '../auth/server.service';

@Injectable({
    providedIn: 'root'
})
export class ChampService {

    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    /**
     * Get all champs
     */
        getChamps() {
        return this.http.get(ServerService.baseUrl + 'champs');
    }

    /**
     * Find champ by id
     *
     * @param champId
     */
    findById(champId) {
        return this.http.get(ServerService.baseUrl + 'champs/' + champId);
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
        url += 'champs';

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
     * @param champ //
     */
    add(champ: Champ) {
        return this.http.post(ServerService.baseUrl + 'formulaires/champs', champ.serialize());
    }

    /**
     * Edit club
     *
     * @param champ
     */
    edit(champ: Champ) {
        if (champ instanceof Champ) {
            return this.http.put(ServerService.baseUrl + 'formulaires/champs', champ.serialize());
        } else {
            return this.http.put(ServerService.baseUrl + 'formulaires/champs', champ);
        }
    }


    delete(champ: Champ) {
        return this.http.delete(ServerService.baseUrl + 'formulaires/champs/' + champ.id);
    }
}
