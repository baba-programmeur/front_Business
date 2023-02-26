export class Filiale {
    private _id: number;
    private _entiteId: number;
    private _paysId: number;
    private _etat: boolean;


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get entiteId(): number {
        return this._entiteId;
    }

    set entiteId(value: number) {
        this._entiteId = value;
    }

    get paysId(): number {
        return this._paysId;
    }

    set paysId(value: number) {
        this._paysId = value;
    }

    get etat(): boolean {
        return this._etat;
    }

    set etat(value: boolean) {
        this._etat = value;
    }

    serialize() {
        return {
            id: this.id,
            entiteId: this.entiteId,
            paysId: this.paysId,
            etat: this.etat
        };
    }
}
