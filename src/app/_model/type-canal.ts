import {Canal} from './canal';

export class TypeCanal {
    private _id: number;
    private _libelle: string;
    private _actif: number;
    private _canals: Canal[];

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

    get actif(): number {
        return this._actif;
    }

    set actif(value: number) {
        this._actif = value;
    }


    get canals(): Canal[] {
        return this._canals;
    }

    set canals(value: Canal[]) {
        this._canals = value;
    }

    serialize() {
        return {
            id: this.id,
            libelle: this.libelle,
            actif: this.actif
        };
    }
}
