export class Pays {
    private _id: number;
    private _name: string;
    private _alpha2: string;
    private _alpha3: string;
    private _atpsWs: string;
    private _actif: string;
    private _indicatif: number;
    private _drapeau: string;


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get alpha2(): string {
        return this._alpha2;
    }

    set alpha2(value: string) {
        this._alpha2 = value;
    }

    get alpha3(): string {
        return this._alpha3;
    }

    set alpha3(value: string) {
        this._alpha3 = value;
    }

    get atpsWs(): string {
        return this._atpsWs;
    }

    set atpsWs(value: string) {
        this._atpsWs = value;
    }

    get actif(): string {
        return this._actif;
    }

    set actif(value: string) {
        this._actif = value;
    }

    get indicatif(): number {
        return this._indicatif;
    }

    set indicatif(value: number) {
        this._indicatif = value;
    }

    get drapeau(): string {
        return this._drapeau;
    }

    set drapeau(value: string) {
        this._drapeau = value;
    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            alpha2: this.alpha2,
            alpha3: this.alpha3,
            atpsWs: this.atpsWs,
            actif: this.actif,
            indicatif: this.indicatif,
            drapeau: this.drapeau
        };
    }
}
