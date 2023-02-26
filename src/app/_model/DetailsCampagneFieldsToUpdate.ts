export class DetailsCampagneFieldsToUpdate {


    private _idFormulaireDataItem: number;
    private _arrayFieldValue:  Map<string, string>;

    constructor(idFormulaireDataItem: number, arrayFieldValue: Map<string, string>) {
        this._idFormulaireDataItem = idFormulaireDataItem;
        this._arrayFieldValue = arrayFieldValue;
    }

    get idFormulaireDataItem(): number {
        return this._idFormulaireDataItem;
    }

    set idFormulaireDataItem(value: number) {
        this._idFormulaireDataItem = value;
    }
    get arrayFieldValue(): Map<string, string> {
        return this._arrayFieldValue;
    }

    set arrayFieldValue(value: Map<string, string>) {
        this._arrayFieldValue = value;
    }
    public serialize() {

        const convMap = {};

        this._arrayFieldValue.forEach((val: string, key: string) => {
            convMap[key] = val;
        });

        return {
            idFormulaireDataItem: this._idFormulaireDataItem,
            arrayFieldValue: convMap
        }
    }


}
