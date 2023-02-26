import {Injectable} from '@angular/core';
import {Constant} from '../../_constant/constant';
import {AuthService} from '../auth/auth.service';
import {CampagneService} from '../autre/campagne.service';
import {PartenaireWebsocketService} from './partenaire.websocket.service';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class WebsocketSubscriberService {
    constructor(private partenaireWebsocketService: PartenaireWebsocketService,
                private campagneService: CampagneService,
                private router: Router,
                private authService: AuthService) {
    }

    public initPartenaireWebSocket = () => {
        const obs = this.partenaireWebsocketService.getObservable();

        obs.subscribe({
            next: receivedMsg => {
                if (receivedMsg.type === 'SUCCESS') {
                    console.log('updated !!!');
                    console.log(receivedMsg.message);

                    const resp = receivedMsg.message;

                    // update solde
                    if (resp && resp.type && resp.type === 'solde') {
                        const account = JSON.parse(sessionStorage.getItem(Constant.ACCOUNT));
                        if (account && account.souscription) {
                            account.souscription.solde = + resp.data;
                            this.authService.account = account;

                            // update session storage
                            sessionStorage.setItem(Constant.ACCOUNT, JSON.stringify(account));
                        }
                    }

                    // update campagne
                    if (resp && resp.type && resp.type === 'campagne') {
                        this.campagneService.currentCampagne = resp.data;
                        // TODO - Vérifier
                        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                            this.router.navigate(['/accueil/partenaire']));
                    }


                    // update counter for add campagne
                    if (resp && resp.type && resp.type === 'counter') {
                        console.log('Counter : ', resp.data);
                        this.campagneService.compteur = resp.data;
                    }

                }

                this.initPartenaireWebSocket();
            },
            error: err => {
                console.log(err);
            }
        });
    }

}
