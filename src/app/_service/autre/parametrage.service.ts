import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ServerService} from '../auth/server.service';
import {map, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Parametrage} from '../../_model/parametrage';
import {LigneParametrage} from '../../_model/ligne-parametrage';

@Injectable({
    providedIn: 'root'
})
export class ParametrageService {
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
        url += 'parametrages';

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

    findLigneSouscriptionByPartner(page, size, filtres): Observable<any> {
        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'ligne-de-parametrages';

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
     * @param parametrage
     */
    add(parametrage: Parametrage) {
        return this.http.post(ServerService.baseUrl + 'parametrages', parametrage.serialize());
    }

    /**
     * Edit parametrage
     * @param parametrage
     */
    edit(parametrage: Parametrage) {
        console.log('_______________ Objet parametrage à modifier : ', parametrage);
        return this.http.put(ServerService.baseUrl + 'parametrages', parametrage);
    }

    delete(parametrage: Parametrage) {
        return this.http.delete(ServerService.baseUrl + 'parametrages/' + parametrage.id);
    }

    addLigneParametrage(ligne: LigneParametrage) {
        return this.http.post(ServerService.baseUrl + 'partenaire/ligne-de-parametrages', ligne.serialize());
    }
}
