import {Log} from '../../_model/log';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from '../auth/server.service';

@Injectable({
    providedIn: 'root'
})
export class LogService {

    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    /**
     * Get all logs
     */
    getLogs() {
        return this.http.get(ServerService.baseUrl + 'logg-upays?page=0&size=10000000');
    }

    /**
     * Find log by id
     *
     * @param logId
     */
    findById(logId) {
        return this.http.get(ServerService.baseUrl + 'logg-upays/' + logId);
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
        url += 'logg-upays';

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
     * @param log // La log à ajouter
     */
    add(log: Log) {
        return this.http.post(ServerService.baseUrl + 'logg-upays', log.serialize());
    }

    /**
     * Edit club
     *
     * @param campagne
     */
    edit(log: Log) {
        return this.http.put(ServerService.baseUrl + 'logg-upays', log);
    }


    delete(log: Log) {
        return this.http.delete(ServerService.baseUrl + 'logg-upays/' + log.id);
    }
}
