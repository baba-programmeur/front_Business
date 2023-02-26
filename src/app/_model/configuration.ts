export class Configuration {
    private _id: number;
    private _entity: string;
    private _enteteSouscription: string;
    private _enteteDecaissement: string;
    private _enteteEncaissement: string;
    private _tailleCode: number;
    private _plafond: string;


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get entity(): string {
        return this._entity;
    }

    set entity(value: string) {
        this._entity = value;
    }

    get enteteSouscription(): string {
        return this._enteteSouscription;
    }

    set enteteSouscription(value: string) {
        this._enteteSouscription = value;
    }

    get enteteDecaissement(): string {
        return this._enteteDecaissement;
    }

    set enteteDecaissement(value: string) {
        this._enteteDecaissement = value;
    }

    get enteteEncaissement(): string {
        return this._enteteEncaissement;
    }

    set enteteEncaissement(value: string) {
        this._enteteEncaissement = value;
    }

    get tailleCode(): number {
        return this._tailleCode;
    }

    set tailleCode(value: number) {
        this._tailleCode = value;
    }

    get plafond(): string {
        return this._plafond;
    }

    set plafond(value: string) {
        this._plafond = value;
    }

    public serialize() {
        return {
            id: this._id,
            entity: this._entity,
            enteteSouscription: this._enteteSouscription,
            enteteDecaissement: this._enteteDecaissement,
            enteteEncaissement: this._enteteEncaissement,
            tailleCode: this._tailleCode,
            plafond: this._plafond
        };
    }
}
