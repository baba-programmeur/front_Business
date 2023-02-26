export class Plafond {
    private _id: number;
    private _urlAjoutPartenaire: string;
    private _urlBlocage: string;
    private _urlConsultation: string;
    private _urlCredit: string;
    private _urlDebit: string;
    private _urlToken: string;
    private _username: string;
    private _password: string;
    private _configurationId: number;


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }


    get urlAjoutPartenaire(): string {
        return this._urlAjoutPartenaire;
    }

    set urlAjoutPartenaire(value: string) {
        this._urlAjoutPartenaire = value;
    }

    get urlBlocage(): string {
        return this._urlBlocage;
    }

    set urlBlocage(value: string) {
        this._urlBlocage = value;
    }

    get urlConsultation(): string {
        return this._urlConsultation;
    }

    set urlConsultation(value: string) {
        this._urlConsultation = value;
    }

    get urlCredit(): string {
        return this._urlCredit;
    }

    set urlCredit(value: string) {
        this._urlCredit = value;
    }

    get urlDebit(): string {
        return this._urlDebit;
    }

    set urlDebit(value: string) {
        this._urlDebit = value;
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


    get configurationId(): number {
        return this._configurationId;
    }

    set configurationId(value: number) {
        this._configurationId = value;
    }

    serialize() {
        return {
            id: this.id,
            urlAjoutPartenaire: this.urlAjoutPartenaire,
            urlBlocage: this.urlBlocage,
            urlConsultation: this.urlConsultation,
            urlCredit: this.urlCredit,
            urlDebit: this.urlDebit,
            urlToken: this.urlToken,
            username: this.username,
            password: this.password,
            configurationId: this.configurationId
        };
    }
}
