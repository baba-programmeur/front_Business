export class FraisDetail {
    private _id: number;
    private _type: string;
    private _libelle: string;
    private _valeur: string;
    private _statut: string;
    private _canal: string;
    private _partenaire: string;
    private _typeOperation: string;
    private _canalId: number;
    private _souscriptionId: number;
    private _createdAt: Date;
    private _updatedAt: Date;


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get libelle(): string {
        return this._libelle;
    }

    set libelle(value: string) {
        this._libelle = value;
    }

    get valeur(): string {
        return this._valeur;
    }

    set valeur(value: string) {
        this._valeur = value;
    }

    get statut(): string {
        return this._statut;
    }

    set statut(value: string) {
        this._statut = value;
    }

    get canal(): string {
        return this._canal;
    }

    set canal(value: string) {
        this._canal = value;
    }

    get typeOperation(): string {
        return this._typeOperation;
    }

    set typeOperation(value: string) {
        this._typeOperation = value;
    }

    get partenaire(): string {
        return this._partenaire;
    }

    set partenaire(value: string) {
        this._partenaire = value;
    }

    get canalId(): number {
        return this._canalId;
    }

    set canalId(value: number) {
        this._canalId = value;
    }

    get souscriptionId(): number {
        return this._souscriptionId;
    }

    set souscriptionId(value: number) {
        this._souscriptionId = value;
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

    serialize() {
        return {
            id: this.id,
            type: this.type,
            libelle: this.libelle,
            valeur: this.valeur,
            statut: this.statut,
            canal: this.canal,
            typeOperation: this.typeOperation,
            partenaire: this.partenaire,
            canalId: this.canalId,
            souscriptionId: this.souscriptionId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
