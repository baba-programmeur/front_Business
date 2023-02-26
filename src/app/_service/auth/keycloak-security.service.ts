import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {KeycloakService} from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class KeycloakSecurityService {

  public keycloakServerUrl = environment.keycloakUrl;
  public keycloakRealm = environment.keycloakRealm;
  public keycloakClientId = environment.keycloakClientId;

  constructor() {
  }

  async init(keycloak: KeycloakService) {

    console.log('Security Initialization ...');
    console.log('Client Id : ', this.keycloakClientId);
    console.log('Realm : ', this.keycloakRealm);

    return new Promise((resolve, reject) => {
      keycloak.init({
        config: {
          url: this.keycloakServerUrl,
          realm: this.keycloakRealm,
          clientId: this.keycloakClientId
        },
        initOptions: {
            // onLoad: 'check-sso',
            checkLoginIframe: true,
            onLoad: 'login-required',
            responseMode: 'fragment'
        },
      }).then(
        value => {
          console.log('User profile');
          console.log(keycloak.getKeycloakInstance().token);
          console.log(keycloak.getKeycloakInstance().profile);
          console.log(keycloak.getKeycloakInstance().userInfo);
          console.log(keycloak.getKeycloakInstance().idTokenParsed);
          resolve(value);
        }
      ).catch(
        err => {
            console.log('Keycloak error....');
            console.log(err);
            reject(err);
        }
      );
    });
  }
}
