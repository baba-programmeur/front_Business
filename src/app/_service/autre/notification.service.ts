import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {Notification} from '../../_model/notification';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map, tap} from 'rxjs/operators';

@Injectable()
export class NotificationService {
    // messaging = firebase.messaging();
    // currentMessage = new BehaviorSubject(null);
    _pushData = new Subject<any>();
    _savedDetailPercent = new Subject<any>();

    set pushData(data) {
        this._pushData.next(data);
    }

    get pushData() {
        return this._pushData;
    }


    get savedDetailPercent(): Subject<any> {
        return this._savedDetailPercent;
    }

    set savedDetailPercent(value) {
        this._savedDetailPercent.next(value);
    }

    constructor(private http: HttpClient,
                private serverService: ServerService) {
    }

    /**
     *
     * @param token
     * @param idUser
     * @param codeEs
     */
    updateToken(token, idUser, codeEs) {
        const body = {
            userId: idUser,
            codeEs: codeEs,
            token: token
        };

        return this.http.post(ServerService.baseUrl + 'fcm_register', body);
    }

    // addMercureSubscription(topic) {
    //     const url = new URL(environment.MERCURE_BASE_URL);
    //     const mercureTopicBase = environment.MERCURE_TOPIC_BASE;
    //
    //     topic = mercureTopicBase + topic;
    //
    //     url.searchParams.append('topic', topic);
    //
    //     const eventSource = new EventSource(url.toJSON());
    //     eventSource.onmessage = event => {
    //         if (event && event.data) {
    //             this.pushData = JSON.parse(event.data);
    //         }
    //     };
    // }


    /**
     * Get all notifications
     *
     * @param page // le numéro de la page
     * @param size // Le nombre d'élément à ajouter
     * @param filtres //
     */
    findAll(page, size, filtres = null): Observable<any> {
        page = page - 1;
        let url = ServerService.baseUrl;
        url += 'histonotifications';

        const sh = this.serverService.getFilterString(filtres);

        return this.http.get<any>(url + '?page=' + page + '&size=' + size + sh , {observe: 'response'})
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
     * Add notification
     *
     * @param notification // Le notification à ajouter
     */
    add(notification: Notification) {
        return this.http.post(ServerService.baseUrl + 'histonotifications', notification.serialize());
    }

    /**
     * Edit notification
     *
     * @param notification
     */
    edit(notification: Notification) {
        return this.http.put(ServerService.baseUrl + 'histonotifications', notification);
    }


    delete(notification: Notification) {
        return this.http.delete(ServerService.baseUrl + 'histonotifications/' + notification.id);
    }
}
