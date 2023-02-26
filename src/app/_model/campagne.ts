export class Campagne {
    private _id: number;
    private _nom: string;
    private _date: string;
    private _user: number;
    private _mois: string;
    private _esp: string;
    private _partner: string;
    private _typeCanal:string;
    private _status: string;
    private _txtsms: string;
    private _type: string;
    private _fraisTotal: number;
    private _montantTotal: number;
    private _fichier: string;
    private _fichierOriginal: string;
    private _filiale: string;
    private _canal:string;
    private _messageRetour:string;


    get canal(): string {
        return this._canal;
    }

    set canal(value: string) {
        this._canal = value;
    }

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

    get date(): string {
        return this._date;
    }

    set date(value: string) {
        this._date = value;
    }

    get user(): number {
        return this._user;
    }

    set user(value: number) {
        this._user = value;
    }

    get mois(): string {
        return this._mois;
    }

    set mois(value: string) {
        this._mois = value;
    }

    get esp(): string {
        return this._esp;
    }

    set esp(value: string) {
        this._esp = value;
    }

    get partner(): string {
        return this._partner;
    }

    set partner(value: string) {
        this._partner = value;
    }

    get typeCanal(): string {
        return this._typeCanal;
    }

    set typeCanal(value: string) {
        this._typeCanal = value;
    }

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }

    get txtsms(): string {
        return this._txtsms;
    }

    set txtsms(value: string) {
        this._txtsms = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get fichier(): string {
        return this._fichier;
    }

    set fichier(value: string) {
        this._fichier = value;
    }

    get fichierOriginal(): string {
        return this._fichierOriginal;
    }

    set fichierOriginal(value: string) {
        this._fichierOriginal = value;
    }


    get filiale(): string {
        return this._filiale;
    }

    set filiale(value: string) {
        this._filiale = value;
    }


    get fraisTotal(): number {
        return this._fraisTotal;
    }

    set fraisTotal(value: number) {
        this._fraisTotal = value;
    }

    get montantTotal(): number {
        return this._montantTotal;
    }

    set montantTotal(value: number) {
        this._montantTotal = value;
    }

    get messageRetour(): string {
        return this._messageRetour;
    }

    set messageRetour(value: string) {
        this._messageRetour = value;
    }

    public serialize() {
        return {
            id: this._id,
            nom: this._nom,
            date: this._date,
            user: this._user,
            mois: this._mois,
            esp: this._esp,
            partner: this._partner,
            typeCanal:this._typeCanal,
            status: this._status,
            txtsms: this._txtsms,
            type: this._type,
            fraisTotal: this._fraisTotal,
            montantTotal: this._montantTotal,
            fichier: this._fichier,
            filiale: this._filiale,
            fichierOriginal: this._fichierOriginal,
            canal:this._canal
        };
    }
}
