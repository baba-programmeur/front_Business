import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerService} from './server.service';
import {Constant} from '../../_constant/constant';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {User} from '../../_model/user';
import {KeycloakService} from 'keycloak-angular';
import {AuthService} from './auth.service';

@Injectable()
export class UserService {
    constructor(public http: HttpClient,
                private authService: AuthService,
                private keycloakService: KeycloakService,
                private serverService: ServerService) {
    }

    public getUsers() {
        return this.http.get(ServerService.kcBaseUrl + 'users');
    }

    public getUsersByOwner() {
        return this.http.get(ServerService.kcBaseUrl + 'users/owner');
    }

    public getUserDetails(id) {
        return this.http.get(ServerService.kcBaseUrl + 'users' + '/' + id + '/details');
    }

    public getUsersBySouscriptionId(id) {
        return this.http.get(ServerService.kcBaseUrl + 'users' + '/' + id + '/souscriptions');
    }

    public getRoles() {
        return this.http.get(ServerService.kcBaseUrl + 'roles');
    }

    public getHabilitations() {
        return this.http.get(ServerService.kcBaseUrl + 'habilitations');
    }

    public getHabilitationsForUser() {
        return this.http.get(ServerService.kcBaseUrl + 'habilitations/user');
    }

    public getUserRoles(id: string) {
        return this.http.get(ServerService.kcBaseUrl + 'users/roles?userId=' + id);
    }

    public getRoleHabilitations(role: string) {
        return this.http.get(ServerService.kcBaseUrl + 'roles/habilitations?role=' + role);
    }

    public updateRoleHabilitations(role, toAdd, toRemove) {
        return this.http.post(ServerService.kcBaseUrl + 'roles/habilitations', {
            name: role, toAdd, toRemove
        })
    }

    public addRolestoUser(idUser, toAdd, toRemove) {
        return this.http.post(ServerService.kcBaseUrl + 'users/' + idUser + '/roles', {id: idUser, toAdd, toRemove});
    }

    public hasPermission(permission) {
        const account: any =  this.getUserInfo();

        if (account && account.habilitations) {
            const items: any[] = account.habilitations;

            for (const item of items) {
                for (const habilitation of item.habilitations) {
                    // tslint:disable-next-line:triple-equals
                    if (habilitation.name == permission) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public changeState(user, state) {
        return this.http.post(ServerService.kcBaseUrl + 'users/change-state?state=' + state, user);
    }

    /**
     * Check if logged in user is admin
     */
    public isAdmin(account = null) {
        return this.keycloakService.isUserInRole('admin');
    }

    public isSuperAdmin(account = null) {
        return this.keycloakService.isUserInRole('super_admin') ||
            this.keycloakService.isUserInRole('superAdmin');
    }

    public isAdminFiliale(account = null) {
        return this.keycloakService.isUserInRole('admin_filiale') ||
            this.keycloakService.isUserInRole('adminFiliale');
    }

    /**
     * Check if logged in user is admin
     */
    public isMarchand(account = null) {
        return this.keycloakService.isUserInRole('partenaire') ||
        this.keycloakService.isUserInRole('partenaire_collecte') ||
        this.keycloakService.isUserInRole('partenaire_paiement') ||
        this.keycloakService.isUserInRole('partenaireCollecte') ||
        this.keycloakService.isUserInRole('partenairePaiement') ||
        this.keycloakService.isUserInRole('partenairecollecte') ||
        this.keycloakService.isUserInRole('partenairepaiement');
    }

    /**
     * Check if logged in user is admin
     */
    public static isAdminFinancier(account = null) {
        if (account === null) {
            account = JSON.parse(sessionStorage.getItem(Constant.ACCOUNT));
        }
        if (account && account.user) {
            const roles: string[] = account.user.authorities;

            if (roles) {
                for (const role of roles) {
                    if (role === 'ROLE_ADMIN_FINANCIER') {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Check if logged in user is admin
     */
    public static isAdminCommercial(account = null) {
        if (account === null) {
            account = JSON.parse(sessionStorage.getItem(Constant.ACCOUNT));
        }
        if (account && account.user) {
            const roles: string[] = account.user.authorities;

            if (roles) {
                for (const role of roles) {
                    if (role === 'ROLE_ADMIN_COMMERCIAL') {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Check if logged in user is partenaire
     */
    public isPartenaire(account = null) {
        return this.keycloakService.isUserInRole('partenaire') ||
            this.keycloakService.isUserInRole('partenairem2t') ||
            this.keycloakService.isUserInRole('partenairecollecte') ||
            this.keycloakService.isUserInRole('partenairepaiement');
    }

    /**
     * Check if logged in user is financier partenaire
     */
    public static isPartenaireFinancier(account = null) {
        if (account === null) {
            account = JSON.parse(sessionStorage.getItem(Constant.ACCOUNT));
        }
        if (account && account.user) {
            const roles: string[] = account.user.authorities;

            if (roles) {
                for (const role of roles) {
                    if (role.includes('PARTENAIRE_FINANCIER')) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Register user
     *
     * @param prenom
     * @param nom
     * @param email
     * @param username
     * @param password
     */
    public register(prenom, nom, email, username, password) {
        const body = {
            activated: false,
            authorities: [
                'ROLE_PARTENAIRE'
            ],
            email,
            firstName: prenom,
            imageUrl: '',
            langKey: 'fr',
            lastName: nom,
            login: username,
            nom,
            password,
            // recaptchaResponse: recaptcha
        };

        return this.http.post(ServerService.baseUrl + 'partenaire/register', body);
    }

    getAccount() {
        return this.http.get(ServerService.baseUrl + 'account');
    }

    editUser(user) {
        return this.http.post(ServerService.baseUrl + 'account', user);
    }

    resetPasswordInit(email) {
        return this.http.post(ServerService.baseUrl + 'account/reset-password/init', email);
    }

    resetPasswordFinish(key, newPassword) {
        return this.http.post(ServerService.baseUrl + 'account/reset-password/finish', {key, newPassword});
    }

    changePassword(currentPassword, newPassword) {
        return this.http.post(ServerService.kcBaseUrl + 'users/change-password', {password: currentPassword, newPassword: newPassword});
    }

    activate(key) {
        return this.http.get(ServerService.baseUrl + 'activate?key=' + key);
    }

    updateProfil(user: User) {
        return this.http.post(ServerService.baseUrl + 'account', user);
    }


    /**
     * Get all users
     *
     * @param page // le numéro de la page
     * @param size // Le nombre d'élément à ajouter
     * @param filters // Liste des champs pour le filtre
     */
    findAll(page, size, filters = null, user): Observable<any> {
        // gestion des filtres par colonne
        const filterString = this.serverService.getFilterString(filters);

        page = page - 1;
        let url = ServerService.baseUrl;
        // si le profil est admin partenaire
        if (user.user.authorities.indexOf('ROLE_PARTENAIRE') !== -1) {
            url += 'souscriptions/' + user.souscription.id + '/users?page=' + page + '&size=' + size;
        } else { // si le profil est admin atps
            url += 'admin/users?page=' + page + '&size=' + size;
        }
        // TODO : mettre url suivant le type de profil du user. /api/souscriptions/{souscriptionId}/users pour le partenaire
        // url += 'users?page=' + page + '&size=' + size;

        if (filterString !== '') {
            url += filterString;
        }

        return this.http.get<any>(url , {observe: 'response'})
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
     * Add club
     *
     * @param role // Le role à ajouter
     */
    addRole(role: any) {
        return this.http.post(ServerService.kcBaseUrl + 'roles', role);
    }

    /**
     *
     * @param role
     */
    editRole(role) {
        return this.http.put(ServerService.kcBaseUrl + 'roles', role);
    }

    /***
     * Add club
     *
     * @param user // L'utilisateur à ajouter
     */
    add(user: any) {
        console.log('_______________ USER TO ADD ___________________');
        console.log(user);
        return this.http.post(ServerService.kcBaseUrl + 'users', user);
    }

    edit(user: User) {
        return this.http.put(ServerService.kcBaseUrl + 'users', user);
    }

    delete(user: User) {
        console.log('je suis la pour la suppression.');
        return this.http.delete(ServerService.baseUrl + 'users/' + user.login);
    }

    getRolesForAuthenticatedUser() {
       const val: any = this.keycloakService.getKeycloakInstance().idTokenParsed;

       if (val && val.roles) {
           const roles = val.roles;

           const result: any[] = [];

           for (const role of roles) {
               // tslint:disable-next-line:triple-equals
                if (role != 'user' && role != 'offline_access' && role != 'uma_authorization') {
                    result.push(role);
                }
           }

           return result;
       }

        return null;
    }

    getUserInfo(): any {
        if (sessionStorage.getItem(Constant.ACCOUNT)) {
            return JSON.parse(sessionStorage.getItem(Constant.ACCOUNT));
        } else {
            return this.keycloakService.getKeycloakInstance().profile;
        }
    }

    getUserHabilitation() {
        const account = JSON.parse(sessionStorage.getItem(Constant.ACCOUNT));
        if (account && account.habilitations) {
            return account.habilitations;
        } else {
            return null;
        }
    }

    getUserSouscription() {
        const account = JSON.parse(sessionStorage.getItem(Constant.ACCOUNT));
        return account.souscription;
    }

    private addIdSouscriptionToRole(role) {
        const souscription = this.getUserSouscription();

        if (souscription) {
            role += ':' + souscription.id;
        }

        return role;
    }

    getUserId() {
       return this.keycloakService.getKeycloakInstance().tokenParsed.sub;
    }

    /**
     * Find roles according to user profile
     */
    findRoles() {
        const url = ServerService.baseUrl;

        // if (UserService.isPartenaire()) {
        //     url += 'partenaires/authorities';
        // } else if (UserService.isAdmin()) {
        //     url += 'admin/authorities';
        // }

        return this.http.get(url);
    }

    findRoleColor(user) {
        if (user && user.authorities) {
            if (user.authorities.includes('ROLE_ADMIN_FINANCIER')) {
                return '#ccaf29';
            }
            if (user.authorities.includes('ROLE_ADMIN_AUDITEUR')) {
                return '#3e53a8';
            }
            if (user.authorities.includes('ROLE_ADMIN')) {
                return '#379632';
            }
            if (user.authorities.includes('ROLE_USER')) {
                return '#bd6351';
            }
            if (user.authorities.includes('ROLE_PARTENAIRE_FINANCIER')) {
                return '#ccaf29';
            }
            if (user.authorities.includes('ROLE_PARTENAIRE_AUDITEUR')) {
                return '#3e53a8';
            }
            if (user.authorities.includes('ROLE_PARTENAIRE')) {
                return '#29ccc1';
            }

            if (user.authorities.length === 0) {
                return 'red';
            }
        } else {
            return '';
        }
    }

    findRole(user: User) {
        if (user && user.authorities) {
            if (user.authorities.includes('ROLE_ADMIN_FINANCIER')) {
                return 'atps_financier';
            }
            if (user.authorities.includes('ROLE_ADMIN_AUDITEUR')) {
                return 'atps_auditeur';
            }
            if (user.authorities.includes('ROLE_ADMIN')) {
                return 'admin';
            }
            if (user.authorities.includes('ROLE_USER')) {
                return 'utilisateur';
            }
            if (user.authorities.includes('ROLE_PARTENAIRE_FINANCIER')) {
                return 'partenaire_financier';
            }
            if (user.authorities.includes('ROLE_PARTENAIRE_AUDITEUR')) {
                return 'partenaire_auditeur';
            }
            if (user.authorities.includes('ROLE_PARTENAIRE')) {
                return 'partenaire';
            }

            if (user.authorities.length === 0) {
                return 'anonyme';
            }

        } else {
            return null;
        }
    }

    setAccountFromStorage(object): any {
        sessionStorage.setItem(Constant.ACCOUNT, JSON.stringify(object));
    }

}
