export class Authorisation {
    private _id: number;
    private _code: string;
    private _libelle: string;
    private _endpoint: string;
    private _method: string;
    private _users: any;


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get libelle(): string {
        return this._libelle;
    }

    set libelle(value: string) {
        this._libelle = value;
    }

    get endpoint(): string {
        return this._endpoint;
    }

    set endpoint(value: string) {
        this._endpoint = value;
    }

    get method(): string {
        return this._method;
    }

    set method(value: string) {
        this._method = value;
    }

    get users(): string {
        return this._users;
    }

    set users(value: string) {
        this._users = value;
    }

    serialize() {
        return {
            id: this.id,
            code: this.code,
            libelle: this.libelle,
            endpoint: this.endpoint,
            method: this.method,
            users: this.users
        };
    }
}
