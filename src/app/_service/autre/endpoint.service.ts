import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Endpoint} from '../../_model/endpoint';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
    constructor(private http: HttpClient) {
    }

    findAllByCanal(canalId) {
        return this.http.get(ServerService.baseUrl + 'transfert-requests?canalId.equals=' + canalId);
    }


    /***
     * Add endpoint
     *
     * @param endpoint // Le endpoint à ajouter
     */
    add(endpoint: Endpoint) {
        return this.http.post(ServerService.baseUrl + 'transfert-requests', endpoint.serialize());
    }

    /**
     * Edit endpoint
     *
     * @param endpoint
     */
    edit(endpoint: Endpoint) {
        return this.http.put(ServerService.baseUrl + 'transfert-requests', endpoint.serialize());
    }


    delete(endpoint: Endpoint) {
        return this.http.delete(ServerService.baseUrl + 'transfert-requests/' + endpoint.id);
    }
}
