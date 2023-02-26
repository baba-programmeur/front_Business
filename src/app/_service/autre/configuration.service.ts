import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {Observable, Subject} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Configuration} from '../../_model/configuration';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {
    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    /**
     * Get all configurations
     */
    getConfigurations() {
        return this.http.get(ServerService.baseUrl + 'configurations');
    }

    /**
     * Find configuration by id
     *
     * @param configurationId
     */
    findById(configurationId) {
        return this.http.get(ServerService.baseUrl + 'configurations/' + configurationId);
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
        url += 'configurations';

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

    /**
     * Get all clubs
     *
     * @param page // le numéro de la page
     * @param size // Le nombre d'élément à ajouter
     * @param filtres // liste filtre
     */
    findMy(page, size, filtres = null): Observable<any> {
        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'configurations/my';

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
     * @param configuration //
     */
    add(configuration: Configuration) {
        return this.http.post(ServerService.baseUrl + 'configurations', configuration.serialize());
    }

    /**
     * Edit club
     *
     * @param configuration
     */
    edit(configuration: Configuration) {
        if (configuration instanceof Configuration) {
            return this.http.put(ServerService.baseUrl + 'configurations', configuration.serialize());
        } else {
            return this.http.put(ServerService.baseUrl + 'configurations', configuration);
        }
    }


    delete(configuration: Configuration) {
        return this.http.delete(ServerService.baseUrl + 'configurations/' + configuration.id);
    }
}
