import {Formulaire} from '../../_model/formulaire';
import {map, tap} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from '../auth/server.service';

@Injectable({
    providedIn: 'root'
})
export class FormulaireService {
    _formulaireElementToEdit = new Subject<any>();

    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    set formulaireElementToEdit(data) {
        this._formulaireElementToEdit.next(data);
    }

    get formulaireElementToEdit() {
        return this._formulaireElementToEdit;
    }

    /**
     * Get all formulaires
     */
        getFormulaires() {
        return this.http.get(ServerService.baseUrl + 'formulaires');
    }

    /**
     * Get formulaire details
     */
    findFormulaireDetails(slug: string) {
        return this.http.get(ServerService.baseUrl + 'formulaires/' + slug + '/details');
    }

    /**
     * Find formulaire by id
     *
     * @param formulaireId
     */
    findById(formulaireId) {
        return this.http.get(ServerService.baseUrl + 'formulaires/' + formulaireId);
    }

    findByTag(tag) {
        return this.http.get(ServerService.baseUrl + 'formulaires/' + tag + '/champs')
    }

    getAll() {
        return this.http.get(ServerService.baseUrl + 'formulaires');
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
        url += 'formulaires';

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
     * @param formulaire //
     */
    add(formulaire) {
        console.log('___________ Ajout de formulaire __________________');
        console.log(formulaire);
        return this.http.post(ServerService.baseUrl + 'formulaires', formulaire.serialize());
    }

    /**
     * Edit club
     *
     * @param formulaire
     */
    edit(formulaire: Formulaire) {
        return this.http.put(ServerService.baseUrl + 'formulaires', formulaire);
    }


    delete(formulaire: Formulaire) {
        return this.http.delete(ServerService.baseUrl + 'formulaires/' + formulaire.id);
    }

    /**
     * Get details by campagne id
     *
     * @param id
     */
    getDatas(slug) {
        return this.http.get(ServerService.baseUrl + 'formulaires/' + slug + '/datas');
    }

    /**
     * Get details by campagne id
     *
     * @param id
     */
    getDatasByValueKey(slug, valeur, key) {
        return this.http.get(ServerService.baseUrl + 'formulaires/' + slug + '/datas/' + valeur + '/' + key);
    }
}
