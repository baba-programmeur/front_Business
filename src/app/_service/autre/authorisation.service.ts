import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ServerService} from '../auth/server.service';
import {map, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Authorisation} from '../../_model/authorisation';

@Injectable({
    providedIn: 'root'
})
export class AuthorisationService {
    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    /**
     * Get all authorisation
     *
     * @param page // le numéro de la page
     * @param size // Le nombre d'élément à ajouter
     */
    findAll(page, size, filtres = null): Observable<any> {
        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'allAuthorisations';

        const filtreString = this.serverService.getFilterString(filtres);

        return this.http.get<any>(url , {observe: 'response'})
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
     * Add authorisation
     *
     * @param authorisation // Le authorisation à ajouter
     */
    add(authorisation: Authorisation) {
        return this.http.post(ServerService.baseUrl + 'authorisations', authorisation.serialize());
    }

    /**
     * Edit authorisation
     *
     * @param authorisation
     */
    edit(authorisation: Authorisation) {
        return this.http.put(ServerService.baseUrl + 'authorisations', authorisation);
    }

    delete(authorisation: Authorisation) {
        return this.http.delete(ServerService.baseUrl + 'authorisations/' + authorisation.id);
    }
}
