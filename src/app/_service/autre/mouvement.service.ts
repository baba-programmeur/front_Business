import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {Observable, Subject} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Mouvement} from '../../_model/mouvement';

@Injectable({
  providedIn: 'root'
})
export class MouvementService {
    private SHOW_MOUVEMENT = new Subject<any>();

    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    set showMouvement(val) {
        this.SHOW_MOUVEMENT.next(val);
    }
    get showMouvement(): Subject<any> {
        return this.SHOW_MOUVEMENT;
    }

    /**
     * Get all mouvements
     *
     * @param page // le numéro de la page
     * @param size // Le nombre d'élément à ajouter
     * @param filtres
     */
    findAll(page, size, filtres = null): Observable<any> {
        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'mouvements';

        const filtrString = this.serverService.getFilterString(filtres);

        return this.http.get<any>(url + '?page=' + page + '&size=' + size + filtrString , {observe: 'response'})
            .pipe(
                tap(response => {
                    console.log(response);
                }),
                map(response => {
                    return this.serverService.extractData<any>(response, response.headers);
                })
            );
    }

    findAllForPartenaire(page, size, filtres = null): Observable<any> {
        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'partenaire/mouvements';

        const filtrString = this.serverService.getFilterString(filtres);

        return this.http.get<any>(url + '?page=' + page + '&size=' + size + filtrString , {observe: 'response'})
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
     * @param mouvement // Le mouvement à ajouter
     */
    add(mouvement: Mouvement) {
        return this.http.post(ServerService.baseUrl + 'partenaire/mouvements', mouvement.serialize());
    }

    /**
     * Edit canal
     *
     * @param mouvement
     */
    edit(mouvement: Mouvement) {
        return this.http.put(ServerService.baseUrl + 'mouvements', mouvement);
    }

    delete(mouvement: Mouvement) {
        return this.http.delete(ServerService.baseUrl + 'mouvements/' + mouvement.id);
    }

    cancel(mouvement: Mouvement) {
        return this.http.put(ServerService.baseUrl + 'mouvements/cancel', mouvement);
    }

    correct(mouvement: Mouvement, montant) {
        return this.http.put(ServerService.baseUrl + 'mouvements/correct?montant=' + montant, mouvement);
    }
}
