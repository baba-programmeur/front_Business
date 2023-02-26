import {ProfilFraisPartenaire} from './profil-frais-partenaire';

export class Plage {
    private _id: number;
    private _min: number;
    private _max: number;
    private _montant: number;
    private _idFraisId: number;


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get min(): number {
        return this._min;
    }

    set min(value: number) {
        this._min = value;
    }

    get max(): number {
        return this._max;
    }

    set max(value: number) {
        this._max = value;
    }

    get montant(): number {
        return this._montant;
    }

    set montant(value: number) {
        this._montant = value;
    }

    get idFraisId(): number {
        return this._idFraisId;
    }

    set idFraisId(value: number) {
        this._idFraisId = value;
    }

    serialize() {
        return {
            id: this.id,
            min: this.min,
            max: this.max,
            montant: this.montant,
            idFraisId: this.idFraisId
        };
    }

    static serializeArray(details: Plage[]) {
        const result: any[] = [];
        if (details && details.length !== 0) {
            for (const detail of details) {
                if (detail instanceof Plage) {
                    result.push(detail.serialize());
                } else {
                    result.push(detail);
                }
            }
        }

        return result;
    }
}
