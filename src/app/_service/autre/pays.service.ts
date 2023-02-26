import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ServerService} from '../auth/server.service';
import {map, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Pays} from '../../_model/pays';

@Injectable({
    providedIn: 'root'
})
export class PaysService {
    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }
    
    /**
     * Get all pays
     *
     * @param page // le numéro de la page
     * @param size // Le nombre d'élément à ajouter
     */
    findAll(page, size, filtres = null): Observable<any> {
        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'pays';

        const filtreString = this.serverService.getFilterString(filtres);

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
     * Add pays
     *
     * @param pays // Le pays à ajouter
     * @param serialise
     */
    add(pays: Pays, serialise: Boolean) {
        return this.http.post(ServerService.baseUrl + 'pays', serialise ? pays.serialize() : pays);
    }

    /**
     * Edit pays
     *
     * @param pays
     */
    edit(pays: Pays) {
        return this.http.put(ServerService.baseUrl + 'pays', pays);
    }


    delete(pays: Pays) {
        return this.http.delete(ServerService.baseUrl + 'pays/' + pays.id);
    }

    getAllPays() {
        return this.http.get(ServerService.baseUrl + 'pays?page=0&size=10000');
    }
}
