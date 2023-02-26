import {FixedStompConfig} from './fixed-stomp-config.service';
import {environment} from '../../../environments/environment';

export const stompConfig: FixedStompConfig = {
    webSocketFactory: () => {
        const socketServerUrl = environment.WEB_SOCKET_BASE_URL;

        if (WebsocketInstance.instance) {
            return WebsocketInstance.instance;
        } else {
            WebsocketInstance.instance = new WebSocket(socketServerUrl);
            return WebsocketInstance.instance;
        }
    }
};

export class WebsocketInstance {
    public static instance;

    public  static getInstance() {
        return stompConfig;
    }
}
