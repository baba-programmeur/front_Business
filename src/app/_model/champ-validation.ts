export class ChampValidation {
    private _id: number;
    private _typeValidation: string;
    private _valeur: string;
    private _errorMessage: string;
    private _champId: number;

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }


    get typeValidation(): string {
        return this._typeValidation;
    }

    set typeValidation(value: string) {
        this._typeValidation = value;
    }

    get valeur(): string {
        return this._valeur;
    }

    set valeur(value: string) {
        this._valeur = value;
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    set errorMessage(value: string) {
        this._errorMessage = value;
    }

    get champId(): number {
        return this._champId;
    }

    set champId(value: number) {
        this._champId = value;
    }

    serialize() {
        return {
            id: this.id,
            typeValidation: this.typeValidation,
            valeur: this.valeur,
            errorMessage: this.errorMessage,
            champId: this.champId
        };
    }
}
