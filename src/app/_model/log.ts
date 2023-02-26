export class Log {
    private _id: number;
    private _codePartenaire: string;
    private _dateAction: string;
    private _libelleAction: string;
    private _descriptionAction: string;
    private _userId: string;
    private _campagneId: number;
    private _reference: string;
    private _login: string;
    private _profil: string;
    private _entite: string;
    private _filiale: string;
    private _niveauVisibilite: string;


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }


    get codePartenaire(): string {
        return this._codePartenaire;
    }

    set codePartenaire(value: string) {
        this._codePartenaire = value;
    }

    get dateAction(): string {
        return this._dateAction;
    }

    set dateAction(value: string) {
        this._dateAction = value;
    }

    get libelleAction(): string {
        return this._libelleAction;
    }

    set libelleAction(value: string) {
        this._libelleAction = value;
    }

    get descriptionAction(): string {
        return this._descriptionAction;
    }

    set descriptionAction(value: string) {
        this._descriptionAction = value;
    }

    get userId(): string {
        return this._userId;
    }

    set userId(value: string) {
        this._userId = value;
    }

    get campagneId(): number {
        return this._campagneId;
    }

    set campagneId(value: number) {
        this._campagneId = value;
    }

    get reference(): string {
        return this._reference;
    }

    set reference(value: string) {
        this._reference = value;
    }

    get login(): string {
        return this._login;
    }

    set login(value: string) {
        this._login = value;
    }

    get profil(): string {
        return this._profil;
    }

    set profil(value: string) {
        this._profil = value;
    }

    get entite(): string {
        return this._entite;
    }

    set entite(value: string) {
        this._entite = value;
    }

    get filiale(): string {
        return this._filiale;
    }

    set filiale(value: string) {
        this._filiale = value;
    }

    get niveauVisibilite(): string {
        return this._niveauVisibilite;
    }

    set niveauVisibilite(value: string) {
        this._niveauVisibilite = value;
    }

    public serialize() {
        return {
            id: this._id,
            codePartenaire: this._codePartenaire,
            dateAction: this._dateAction,
            libelleAction: this._libelleAction,
            descriptionAction: this._descriptionAction,
            userId: this._userId,
            campagneId: this._campagneId,
            reference: this._reference,
            login: this._login,
            profil: this._profil,
            entite: this._entite,
            filiale: this._filiale,
            niveauVisibilite: this._niveauVisibilite,
        };
    }
}
