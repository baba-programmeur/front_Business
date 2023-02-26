import {Souscription} from './souscription';
import {User} from './user';
import {Pays} from './pays';

export class Compte {
    private _user: User;
    private _souscription: Souscription;
    private _frais: any[];
    private _pays: Pays;


    get user(): User {
        return this._user;
    }

    set user(value: User) {
        this._user = value;
    }

    get souscription(): Souscription {
        return this._souscription;
    }

    set souscription(value: Souscription) {
        this._souscription = value;
    }


    get pays(): Pays {
        return this._pays;
    }

    set pays(value: Pays) {
        this._pays = value;
    }


    get frais(): any[] {
        return this._frais;
    }

    set frais(value: any[]) {
        this._frais = value;
    }
}
