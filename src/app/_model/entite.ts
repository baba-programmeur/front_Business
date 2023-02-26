export class Entite {
    private _id: number;
    private _nom: string;
    private _ninea: string;
    private _rcc: string;
    private _adresse: string;
    private _telephone: string;
    private _logo: string;
    private _couleur1: string;
    private _couleur2: string;
    private _couleur3: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _email: string;
    private _domaine: string;
    private _favicon: string;
    private _police: string;
    private _statut: string;
    private _pays: string;


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get nom(): string {
        return this._nom;
    }

    set nom(value: string) {
        this._nom = value;
    }

    get ninea(): string {
        return this._ninea;
    }

    set ninea(value: string) {
        this._ninea = value;
    }

    get rcc(): string {
        return this._rcc;
    }

    set rcc(value: string) {
        this._rcc = value;
    }

    get adresse(): string {
        return this._adresse;
    }

    set adresse(value: string) {
        this._adresse = value;
    }

    get telephone(): string {
        return this._telephone;
    }

    set telephone(value: string) {
        this._telephone = value;
    }

    get logo(): string {
        return this._logo;
    }

    set logo(value: string) {
        this._logo = value;
    }

    get couleur1(): string {
        return this._couleur1;
    }

    set couleur1(value: string) {
        this._couleur1 = value;
    }

    get couleur2(): string {
        return this._couleur2;
    }

    set couleur2(value: string) {
        this._couleur2 = value;
    }

    get couleur3(): string {
        return this._couleur3;
    }

    set couleur3(value: string) {
        this._couleur3 = value;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    set createdAt(value: Date) {
        this._createdAt = value;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    set updatedAt(value: Date) {
        this._updatedAt = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get domaine(): string {
        return this._domaine;
    }

    set domaine(value: string) {
        this._domaine = value;
    }

    get favicon(): string {
        return this._favicon;
    }

    set favicon(value: string) {
        this._favicon = value;
    }

    get police(): string {
        return this._police;
    }

    set police(value: string) {
        this._police = value;
    }

    get statut(): string {
        return this._statut;
    }

    set statut(value: string) {
        this._statut = value;
    }

    get pays(): string {
        return this._pays;
    }

    set pays(value: string) {
        this._pays = value;
    }

    public serialize() {
        return {
            id: this._id,
            nom: this._nom,
            ninea: this._ninea,
            rcc: this._rcc,
            adresse: this._adresse,
            telephone: this._telephone,
            logo: this._logo,
            couleur1: this._couleur1,
            couleur2: this._couleur2,
            couleur3: this._couleur3,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            email: this._email,
            domaine: this._domaine,
            favicon: this._favicon,
            police: this._police,
            statut: this._statut,
            pays: this._pays
        };
    }
}
