export class Notification {
    private _id: number;
    private _contenusms: string;
    private _datesms: string;
    private _idclt: number;
    private _idcmpg: number;
    private _iduser: number;
    private _mois: string;
    private _statussms: string;
    private _telclt: string;


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get contenusms(): string {
        return this._contenusms;
    }

    set contenusms(value: string) {
        this._contenusms = value;
    }

    get datesms(): string {
        return this._datesms;
    }

    set datesms(value: string) {
        this._datesms = value;
    }

    get idclt(): number {
        return this._idclt;
    }

    set idclt(value: number) {
        this._idclt = value;
    }

    get idcmpg(): number {
        return this._idcmpg;
    }

    set idcmpg(value: number) {
        this._idcmpg = value;
    }

    get iduser(): number {
        return this._iduser;
    }

    set iduser(value: number) {
        this._iduser = value;
    }

    get mois(): string {
        return this._mois;
    }

    set mois(value: string) {
        this._mois = value;
    }

    get statussms(): string {
        return this._statussms;
    }

    set statussms(value: string) {
        this._statussms = value;
    }

    get telclt(): string {
        return this._telclt;
    }

    set telclt(value: string) {
        this._telclt = value;
    }

    public serialize() {
        return {
            id: this.id,
            contenusms: this.contenusms,
            datesms: this.datesms,
            idclt: this.idclt,
            idcmpg: this.idcmpg,
            iduser: this.iduser,
            mois: this.mois,
            statussms: this.statussms,
            telclt: this.telclt
        };
    }
}
