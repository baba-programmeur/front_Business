export class Endpoint {
    private _id: number;
    private _libelle: string;
    private _url: string;
    private _method: string;
    private _body: string;
    private _headers: string;
    private _reponse: string;
    private _codeKey: string;
    private _urlToken: string;
    private _username: string;
    private _password: string;
    private _messageKey: string;
    private _successCode: string;
    private _canalId: number;


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get libelle(): string {
        return this._libelle;
    }

    set libelle(value: string) {
        this._libelle = value;
    }

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }

    get method(): string {
        return this._method;
    }

    set method(value: string) {
        this._method = value;
    }

    get body(): string {
        return this._body;
    }

    set body(value: string) {
        this._body = value;
    }

    get headers(): string {
        return this._headers;
    }

    set headers(value: string) {
        this._headers = value;
    }

    get reponse(): string {
        return this._reponse;
    }

    set reponse(value: string) {
        this._reponse = value;
    }

    get codeKey(): string {
        return this._codeKey;
    }

    set codeKey(value: string) {
        this._codeKey = value;
    }

    get urlToken(): string {
        return this._urlToken;
    }

    set urlToken(value: string) {
        this._urlToken = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get messageKey(): string {
        return this._messageKey;
    }

    set messageKey(value: string) {
        this._messageKey = value;
    }

    get successCode(): string {
        return this._successCode;
    }

    set successCode(value: string) {
        this._successCode = value;
    }

    get canalId(): number {
        return this._canalId;
    }

    set canalId(value: number) {
        this._canalId = value;
    }

    serialize() {
        return {
            id: this.id,
            libelle: this.libelle,
            url: this.url,
            method: this.method,
            body: this.body,
            headers: this.headers,
            reponse: this.reponse,
            codeKey: this.codeKey,
            urlToken: this.urlToken,
            username: this.username,
            password: this.password,
            messageKey: this.messageKey,
            successCode: this.successCode,
            canalId: this.canalId
        };
    }
}
