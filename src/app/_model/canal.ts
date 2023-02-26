export class Canal {
    private _id: number;
    private _libelle: string;
    private _pays: string;
    private _actif: number;
    private _montantMin: number;
    private _montantMax: number;
    private _idService: number;
    private _typeCanalIdId: number;
    private _entiteId: number;


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

    get pays(): string {
        return this._pays;
    }

    set pays(value: string) {
        this._pays = value;
    }

    get actif(): number {
        return this._actif;
    }

    set actif(value: number) {
        this._actif = value;
    }


    get idService(): number {
        return this._idService;
    }

    set idService(value: number) {
        this._idService = value;
    }


    get montantMin(): number {
        return this._montantMin;
    }

    set montantMin(value: number) {
        this._montantMin = value;
    }

    get montantMax(): number {
        return this._montantMax;
    }

    set montantMax(value: number) {
        this._montantMax = value;
    }

    get typeCanalIdId(): number {
        return this._typeCanalIdId;
    }

    set typeCanalIdId(value: number) {
        this._typeCanalIdId = value;
    }

    get entiteId(): number {
        return this._entiteId;
    }

    set entiteId(value: number) {
        this._entiteId = value;
    }

    serialize() {
        return {
            id: this.id,
            libelle: this.libelle,
            pays: this.pays,
            actif: this.actif,
            montantMin: this.montantMin,
            montantMax: this.montantMax,
            idService: this.idService,
            typeCanalIdId: this.typeCanalIdId,
            entiteId: this.entiteId
        };
    }
}
