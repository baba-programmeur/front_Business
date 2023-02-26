export class FormulaireItem {
    private _id: number;
    private _type: string;
    private _niveau: number;
    private _formulaireId: number;
    private _formulaireItemId: number;

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }


    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get niveau(): number {
        return this._niveau;
    }

    set niveau(value: number) {
        this._niveau = value;
    }

    get formulaireId(): number {
        return this._formulaireId;
    }

    set formulaireId(value: number) {
        this._formulaireId = value;
    }

    get formulaireItemId(): number {
        return this._formulaireItemId;
    }

    set formulaireItemId(value: number) {
        this._formulaireItemId = value;
    }

    serialize() {
        return {
            id: this.id,
            type: this.type,
            niveau: this.niveau,
            formulaireId: this.formulaireId,
            formulaireItemId: this.formulaireItemId
        };
    }
}
