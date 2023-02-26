import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment} from '../../../environments/environment';

@Injectable()
export class ServerService {
    public static baseUrl = environment.apiUrl;
    public static kcBaseUrl = environment.kcUrl;

    constructor(private http: HttpClient) {}

    uploadUserImage(file) {
        const fd = new FormData();
        fd.append('file', file, file.name);

        return this.http.post(ServerService.baseUrl + 'users/upload-user', fd);
    }

    uploadPaysImage(file, paysId) {
        const fd = new FormData();
        fd.append('file', file, file.name);

        return this.http.post(ServerService.baseUrl + 'pays/' + paysId + '/drapeau', fd);
    }


    public extractData<T>(response: HttpResponse<any>, headers: HttpHeaders) {
        let data: T[];
        data = response.body;

        if (data) {
            data.reverse();
        }

        return {
            link: headers.get('link'),
            totalItems: headers.get('X-Total-Count'),
            data
        };
    }

    /**
     * Construire la chaine pour le filtre
     *
     * @param filters
     */
    getFilterString(filters) {
        let filterString = '';

        if (filters) {
            for (const filtre of filters) {
                if (filtre.type === 'in') {
                    const arr = filtre.value.split(',');
                    for (const item of arr) {
                        filterString += '&' + filtre.tag + '.' + filtre.type + '=' + item;
                    }
                } else {
                    filterString += '&' + filtre.tag + '.' + filtre.type + '=' + filtre.value;
                }
            }
        }
        console.log('Les filtres');
        console.log(filterString);
        return filterString;
    }

    /**
     * Construire la chaine pour le filtre
     *
     * @param filters
     */
    getFilterStringDynamic(filters) {
        let filterStringLabel = '';
        let filterStringValeur = '';
        if (filters) {
            for (const filtre of filters) {
                filterStringLabel += filtre.tag + ',';
                filterStringValeur += filtre.value + ',';
            }
            filterStringLabel = '&slug.in=' + filterStringLabel;
            filterStringValeur = '&valeur.in=' + filterStringValeur;
        }

        console.log('Les filtres');
        console.log(filterStringLabel.slice(0, filterStringLabel.length - 1) + filterStringValeur.slice(0, filterStringValeur.length - 1));
        return filterStringLabel.slice(0, filterStringLabel.length - 1) + filterStringValeur.slice(0, filterStringValeur.length - 1);
    }
}
