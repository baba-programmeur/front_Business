import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {FormulaireItem} from '../../_model/formulaire-item';

@Injectable({
    providedIn: 'root'
})
export class FormulaireItemService {

    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    /**
     * Get all formulaireItems
     */
        getFormulaireItems() {
        return this.http.get(ServerService.baseUrl + 'formulaireItems');
    }

    /**
     * Find formulaireItem by id
     *
     * @param formulaireItemId
     */
    findById(formulaireItemId) {
        return this.http.get(ServerService.baseUrl + 'formulaire-items/' + formulaireItemId);
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
        url += 'formulaire-items';

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
     * @param formulaireItem //
     */
    add(formulaireItem: FormulaireItem) {
        return this.http.post(ServerService.baseUrl + 'formulaires/items', formulaireItem.serialize());
    }

    /**
     * Edit club
     *
     * @param formulaireItem
     */
    edit(formulaireItem: FormulaireItem) {
        return this.http.put(ServerService.baseUrl + 'formulaire-items', formulaireItem);
    }


    delete(formulaireItem: FormulaireItem) {
        return this.http.delete(ServerService.baseUrl + 'admin/formulaire-items/' + formulaireItem.id);
    }
}
