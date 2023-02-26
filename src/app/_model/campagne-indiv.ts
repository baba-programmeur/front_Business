import {DetailCampagne} from './detail-campagne';

export class CampagneIndiv {
    private _idCampagne: number;
    private _nomCampagne: string;
    private _typeCampage: string;
    private _detail: DetailCampagne;


    get idCampagne(): number {
        return this._idCampagne;
    }

    set idCampagne(value: number) {
        this._idCampagne = value;
    }

    get nomCampagne(): string {
        return this._nomCampagne;
    }

    set nomCampagne(value: string) {
        this._nomCampagne = value;
    }

    get typeCampagne(): string {
        return this._typeCampage;
    }

    set typeCampagne(value: string) {
        this._typeCampage = value;
    }

    get detail(): DetailCampagne {
        return this._detail;
    }

    set detail(value: DetailCampagne) {
        this._detail = value;
    }

    public serialize() {
        return {
            idCampagne: this._idCampagne,
            nomCampagne: this._nomCampagne,
            typeCampagne: this._typeCampage,
            detail: this._detail.serialize(),
        };
    }
}
