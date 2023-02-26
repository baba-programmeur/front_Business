import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from './auth/server.service';
import {Plage} from '../_model/plage';

@Injectable({
    providedIn: 'root'
})
export class PlageService {
    constructor(private http: HttpClient) {
    }

    getPlageByFrais(fraisId) {
        return this.http.get(ServerService.baseUrl + 'plages?idFraisId.equals=' + fraisId);
    }

    addPlageToFrais(plage: Plage, souscriptionId) {
        return this.http.post(ServerService.baseUrl + 'souscriptions/' + souscriptionId + '/plages', plage.serialize());
    }
}
