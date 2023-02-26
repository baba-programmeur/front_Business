import {Souscription} from './../../_model/souscription';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {FormulaireData} from '../../_model/formulaire-data';
import {FormulaireItemData} from '../../_model/formulaire-item-data';

@Injectable({
    providedIn: 'root'
})
export class SouscriptionService {

    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    /**
     * Get all souscriptions
     */
    getSouscriptions() {
        return this.http.get(ServerService.baseUrl + 'souscriptions?page=0&size=10000000');
    }

    /**
     * Find souscription by id
     *
     * @param souscriptionId
     */
    findById(souscriptionId) {
        return this.http.get(ServerService.baseUrl + 'souscriptions/' + souscriptionId);
    }

    /**
     * Find souscription by code
     *
     * @param code
     */
    findByCode(code) {
        return this.http.get(ServerService.baseUrl + 'souscriptions?codees.equals=' + code);
    }

    findSouscription() {
        return this.http.get(ServerService.baseUrl + 'souscriptions/by-user');
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
        url += 'souscriptions';

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
     * @param souscription // La souscription à ajouter
     */
    add(souscription: Souscription) {
        return this.http.post(ServerService.baseUrl + 'souscriptions', souscription.serialize());
    }

    addFormulaireData(data, tag) {
        console.log('******** In addFormulaireData ***********');
        console.log('-----tag : ');
        console.log(tag);
        console.log('-----data ');
        console.log(data);
        const formulaireData: FormulaireData = new FormulaireData();
        formulaireData.slug = tag;
        formulaireData.items = [];

        if (data) {
            const entries = Object.entries(data);

            for (const item of entries) {
                const formulaireItemData: FormulaireItemData = new FormulaireItemData();

                if (item && item.length === 2) {
                    formulaireItemData.slug = item[0];
                    formulaireItemData.valeur = item[1].toString();

                    formulaireData.items.push(formulaireItemData);
                }
            }
        }
        console.log('------ FormulaireData posted : ');
        console.log(formulaireData);
        return this.http.post(ServerService.baseUrl + 'formulaires/data', formulaireData.serialize());
    }

    updateFormulaireData(data, tag) {
        const formulaireData: FormulaireData = new FormulaireData();
        formulaireData.slug = tag;
        formulaireData.id = data.id;
        formulaireData.items = [];

        if (data) {
            const entries = Object.entries(data);

            for (const item of entries) {
                const formulaireItemData: FormulaireItemData = new FormulaireItemData();

                if (item && item.length === 2) {
                    formulaireItemData.slug = item[0];
                    formulaireItemData.valeur = item[1].toString();

                    formulaireData.items.push(formulaireItemData);
                }
            }
        }


        return this.http.put(ServerService.baseUrl + 'formulaires/data', formulaireData.serialize());
    }

    /**
     * Edit club
     *
     * @param campagne
     */
    edit(souscription: Souscription) {
        return this.http.put(ServerService.baseUrl + 'souscriptions', souscription);
    }


    delete(souscription: Souscription) {
        return this.http.delete(ServerService.baseUrl + 'souscriptions/' + souscription.id);
    }

    consulterSolde(id: any) {
        return this.http.get(ServerService.baseUrl + 'souscriptions/' + id + '/solde');
    }
}
