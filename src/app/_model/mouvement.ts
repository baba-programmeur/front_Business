export class Mouvement {
    private _dateVersement: string;
    private _etat: string;
    private _id: number;
    private _libelleCompte: string;
    private _montant: number;
    private _numeroCompte: string;
    private _reference: string;
    private _souscriptionId: number;
    private _type: string;
    private _typeCompte: string;
    private _userId: string;


    get dateVersement(): string {
        return this._dateVersement;
    }

    set dateVersement(value: string) {
        this._dateVersement = value;
    }

    get etat(): string {
        return this._etat;
    }

    set etat(value: string) {
        this._etat = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get libelleCompte(): string {
        return this._libelleCompte;
    }

    set libelleCompte(value: string) {
        this._libelleCompte = value;
    }

    get montant(): number {
        return this._montant;
    }

    set montant(value: number) {
        this._montant = value;
    }

    get numeroCompte(): string {
        return this._numeroCompte;
    }

    set numeroCompte(value: string) {
        this._numeroCompte = value;
    }

    get reference(): string {
        return this._reference;
    }

    set reference(value: string) {
        this._reference = value;
    }

    get souscriptionId(): number {
        return this._souscriptionId;
    }

    set souscriptionId(value: number) {
        this._souscriptionId = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get typeCompte(): string {
        return this._typeCompte;
    }

    set typeCompte(value: string) {
        this._typeCompte = value;
    }

    get userId(): string {
        return this._userId;
    }

    set userId(value: string) {
        this._userId = value;
    }

    public serialize() {
        return {
            dateVersement: this.dateVersement,
            etat: this.etat,
            id: this.id,
            libelleCompte: this.libelleCompte,
            montant: this.montant,
            numeroCompte: this.numeroCompte,
            reference: this.reference,
            souscriptionId: this.souscriptionId,
            type: this.type,
            typeCompte: this.typeCompte,
            userId: this.userId
        };
    }
}
