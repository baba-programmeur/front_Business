export class LigneParametrage {
    private _id: number;
    private _etat: boolean;
    private _parametrageId: string;
    private _souscriptionId: string;
    private _valeur: string;
    private _updatedAt: string;
    private _createdAt: string;

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get etat(): boolean {
        return this._etat;
    }

    set etat(value: boolean) {
        this._etat = value;
    }

    get parametrageId(): string {
        return this._parametrageId;
    }

    set parametrageId(value: string) {
        this._parametrageId = value;
    }

    get valeur(): string {
        return this._valeur;
    }

    set valeur(value: string) {
        this._valeur = value;
    }

    get souscriptionId(): string {
        return this._souscriptionId;
    }

    set souscriptionId(value: string) {
        this._souscriptionId = value;
    }

    get updatedAt(): string {
        return this._updatedAt;
    }

    set updatedAt(value: string) {
        this._updatedAt = value;
    }

    get createdAt(): string {
        return this._createdAt;
    }

    set createdAt(value: string) {
        this._createdAt = value;
    }

    serialize() {
        return {
            id: this.id,
            etat: this.etat,
            valeur: this.valeur,
            parametrageId: this.parametrageId,
            souscriptionId: this.souscriptionId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    constructor(etat: boolean) {
        this._etat = etat;
    }
}
