import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Canal} from '../../_model/canal';

@Injectable({
  providedIn: 'root'
})
export class CanalService {
    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    getTypeCanals() {
        return this.http.get(ServerService.baseUrl + 'type-canals?actif.equals=1');
    }

    getCanals(idTypeCanal, codePays) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(ServerService.baseUrl + 'canals?typeCanalIdId.equals=' + idTypeCanal + '&pays.equals=' + codePays + '&actif.equals=1' + '&entiteId.equals=15465');
    }

    getCanalsEntite(idTypeCanal, codePays) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(ServerService.baseUrl + 'canals/entite?typeCanalIdId.equals=' + idTypeCanal + '&pays.equals=' + codePays + '&actif.equals=1');
    }


    /**
     * Get all canals
     *
     * @param page // le numéro de la page
     * @param size // Le nombre d'élément à ajouter
     * @param typeCanalId
     * @param filtres
     */
    findAll(page, size, typeCanalId, filtres = null): Observable<any> {
        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'canals';

        const filtrString = this.serverService.getFilterString(filtres);

        // tslint:disable-next-line:max-line-length
        return this.http.get<any>(url + '?page=' + page + '&size=' + size + '&typeCanalIdId.equals=' + typeCanalId + filtrString , {observe: 'response'})
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
     * Add canal
     *
     * @param canal // Le canal à ajouter
     */
    add(canal: Canal) {
        return this.http.post(ServerService.baseUrl + 'canals', canal.serialize());
    }

    /**
     * Edit canal
     *
     * @param canal
     */
    edit(canal: Canal) {
        return this.http.put(ServerService.baseUrl + 'canals', canal);
    }


    delete(canal: Canal) {
        return this.http.delete(ServerService.baseUrl + 'canals/' + canal.id);
    }
}
