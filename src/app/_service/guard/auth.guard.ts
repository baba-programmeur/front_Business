import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Router } from '@angular/router';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';
import {UserService} from '../auth/user.service';

@Injectable()
export class AuthGuard extends KeycloakAuthGuard  {
    constructor(
        protected readonly router: Router,
        private userService: UserService,
        protected readonly keycloak: KeycloakService) {
        super(router, keycloak);
    }

    public async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Force the user to log in if currently unauthenticated.
        if (!this.authenticated) {
            await this.keycloak.login({
                redirectUri: window.location.origin + state.url,
            });
        }
        const statut = sessionStorage.getItem('blocPartenaire');

        if (statut && statut === 'bloque' && this.userService.isPartenaire() && state.url !== '/accueil/partenaire') {
            await this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(['/accueil/partenaire']));
        }
        // Get the roles required from the route.
        const requiredRoles = route.data.roles;
        // Allow the user to to proceed if no additional roles are required to access the route.
        if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
            return true;
        }
        // Allow the user to proceed if all the required roles are present.
        return requiredRoles.every((role) => this.roles.includes(role));
    }
    /*isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        console.log('mes roles ', this.roles);
        return new Promise(async (resolve, reject) => {
            if (!this.authenticated) {
                await this.keycloak.login({
                    redirectUri: window.location.origin + state.url,
                });
                return;
            }
            let granted = false;
            const requiredRoles = this.keycloak.getUserRoles();
            console.log('requiredRoles ', requiredRoles);
            if (!requiredRoles || requiredRoles.length === 0) {
                console.log('requiredRoles not true ');
                granted = true;
                resolve(true);
            } else {
                if (!this.roles || this.roles.length === 0) {
                    granted = false;
                    resolve(false);
                }

                for (const requiredRole of requiredRoles) {
                    if (this.roles.indexOf(requiredRole) > -1) {
                        granted = true;
                        break;
                    }
                }
                resolve(granted);
            }
        });
    }*/

}
