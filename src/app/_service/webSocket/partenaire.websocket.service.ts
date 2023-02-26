import { Injectable } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import {WebSocketService} from './websocket.service';
import {WebSocketOptions} from '../../_model/websocket.options';
import {Constant} from '../../_constant/constant';
import {WebsocketInstance} from './websocket-instance.service';

@Injectable()
export class PartenaireWebsocketService extends WebSocketService {
    constructor(stompService: RxStompService) {
        const account = JSON.parse(sessionStorage.getItem(Constant.ACCOUNT));

        const options = [];
        if (account && account.souscription) {
            options.push(new WebSocketOptions('/topic/partenaire/' + account.souscription.id));
        }

        super(stompService, WebsocketInstance.getInstance(), options);
    }
}
