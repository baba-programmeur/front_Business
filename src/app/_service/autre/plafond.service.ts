import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Endpoint} from '../../_model/endpoint';
import {Plafond} from '../../_model/plafond';

@Injectable({
  providedIn: 'root'
})
export class PlafondService {
    constructor(private http: HttpClient) {
    }

    findAllByConfiguration(configurationId) {
        return this.http.get(ServerService.baseUrl + 'plafond-requests?configurationId.equals=' + configurationId);
    }


    /***
     * Add plafond url
     *
     * @param plafond // Le plafond à ajouter
     */
    add(plafond: Plafond) {
        return this.http.post(ServerService.baseUrl + 'plafond-requests', plafond.serialize());
    }

    /**
     * Edit plafond
     *
     * @param plafond
     */
    edit(plafond: Plafond) {
        return this.http.put(ServerService.baseUrl + 'plafond-requests', plafond.serialize());
    }


    delete(plafond: Plafond) {
        return this.http.delete(ServerService.baseUrl + 'plafond-requests/' + plafond.id);
    }
}
