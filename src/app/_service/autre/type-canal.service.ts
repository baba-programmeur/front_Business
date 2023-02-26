import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {TypeCanal} from '../../_model/type-canal';

@Injectable({
  providedIn: 'root'
})
export class TypeCanalService {
    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    /**
     * Get all typeCanals
     *
     * @param page // le numéro de la page
     * @param size // Le nombre d'élément à ajouter
     */
    findAll(page, size, filtres = null): Observable<any> {
        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'type-canals';

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
     * Add typeCanal
     *
     * @param typeCanal // Le typeCanal à ajouter
     */
    add(typeCanal: TypeCanal) {
        console.log('____________ TYPE CANAL A CHARGER ________________');
        console.log(typeCanal);
        return this.http.post(ServerService.baseUrl + 'type-canals', typeCanal.serialize());
    }


    /***
     * Add typeCanal
     *
     * @param typeCanal // Le typeCanal à ajouter
     */
    addPlus(typeCanal: TypeCanal) {
        console.log('____________ TYPE CANAL A CHARGER ________________');
        console.log(typeCanal);
        return this.http.post(ServerService.baseUrl + 'type-canals', typeCanal);
    }

    /**
     * Edit typeCanal
     *
     * @param typeCanal
     */
    edit(typeCanal: TypeCanal) {
        return this.http.put(ServerService.baseUrl + 'type-canals', typeCanal);
    }


    delete(typeCanal: TypeCanal) {
        return this.http.delete(ServerService.baseUrl + 'type-canals/' + typeCanal.id);
    }
}
