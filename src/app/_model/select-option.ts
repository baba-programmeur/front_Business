export class SelectOption {
    private _label: string;
    private _valeur: string;


    get label(): string {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
    }

    get valeur(): string {
        return this._valeur;
    }

    set valeur(value: string) {
        this._valeur = value;
    }
}
