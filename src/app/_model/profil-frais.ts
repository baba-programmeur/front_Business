export class ProfilFrais {
    private _id: number;
    private _libelle: string;
    private _statut: string;
    private _type: string;
    private _valeur: string;
    private _codePartenaire: string;
    private _canalLibelle: string;
    private _souscriptionId: number;
    private _canalId: number;
    private _typeOperation: string;
    private _createdAt: Date;
    private _updatedAt: Date;


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

    get statut(): string {
        return this._statut;
    }

    set statut(value: string) {
        this._statut = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get valeur(): string {
        return this._valeur;
    }

    set valeur(value: string) {
        this._valeur = value;
    }

    get souscriptionId(): number {
        return this._souscriptionId;
    }

    set souscriptionId(value: number) {
        this._souscriptionId = value;
    }

    get canalId(): number {
        return this._canalId;
    }

    set canalId(value: number) {
        this._canalId = value;
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


    get codePartenaire(): string {
        return this._codePartenaire;
    }

    set codePartenaire(value: string) {
        this._codePartenaire = value;
    }

    get canalLibelle(): string {
        return this._canalLibelle;
    }

    set canalLibelle(value: string) {
        this._canalLibelle = value;
    }

    get typeOperation(): string {
        return this._typeOperation;
    }

    set typeOperation(value: string) {
        this._typeOperation = value;
    }

    public serialize() {
        return {
            id: this.id,
            libelle: this.libelle,
            statut: this.statut,
            type: this.type,
            valeur: this.valeur,
            canalId: this.canalId,
            canalLibelle: this.canalLibelle,
            codePartenaire: this.codePartenaire,
            souscriptionId: this.souscriptionId,
            typeOperation: this.typeOperation,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
