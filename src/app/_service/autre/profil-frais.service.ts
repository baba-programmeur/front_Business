import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {ProfilFrais} from '../../_model/profil-frais';
import {FraisDetail} from '../../_model/frais-detail';
import {ProfilFraisPartenaire} from '../../_model/profil-frais-partenaire';

@Injectable({
    providedIn: 'root'
})
export class ProfilFraisService {

    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    /**
     * Get all profilFrais
     *
     * @param page // le numéro de la page
     * @param size // Le nombre d'élément à ajouter
     */
    findAll(page, size, filtres = null): Observable<any> {
        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'profil-frais';

        const filtreString = this.serverService.getFilterString(filtres);

        return this.http.get<any>(url + '?page=' + page + '&size=' + size + filtreString, {observe: 'response'})
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
     * Add profilFrais
     *
     * @param profilFrais // Le profilFrais à ajouter
     */
    add(profilFrais: ProfilFrais) {
        return this.http.post(ServerService.baseUrl + 'profil-frais', profilFrais.serialize());
    }

    /**
     * Edit profilFrais
     *
     * @param profilFrais
     */
    edit(profilFrais: ProfilFrais) {
        console.log('_________ PROFIL FRAIS A ENVOYER ________________');
        console.log(profilFrais);
        return this.http.put(ServerService.baseUrl + 'profil-frais', profilFrais);
    }

    delete(profilFrais: ProfilFrais) {
        return this.http.delete(ServerService.baseUrl + 'profil-frais/' + profilFrais.id);
    }

    getFraisBySouscription(sousId) {
        return this.http.get(ServerService.baseUrl + 'souscriptions/' + sousId + '/profil-frais');
    }

    getProfilsFraisBySouscription(sousId) {
        return this.http.get(ServerService.baseUrl + 'souscriptions/' + sousId + '/frais');
    }

    editSouscriptionFrais(sousId, profilFrais) {
        if (profilFrais instanceof ProfilFraisPartenaire) {
            profilFrais = profilFrais.serialize();
        }

        return this.http.put(ServerService.baseUrl + 'souscriptions/' + sousId + '/profil-frais', profilFrais);
    }
}
