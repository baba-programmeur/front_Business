import {FormulaireItemData} from './formulaire-item-data';

export class FormulaireData {
    private _id: number;
    private _slug: string;
    private _items: FormulaireItemData[];


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get slug(): string {
        return this._slug;
    }

    set slug(value: string) {
        this._slug = value;
    }


    get items(): FormulaireItemData[] {
        return this._items;
    }

    set items(value: FormulaireItemData[]) {
        this._items = value;
    }

    serialize() {
        let items = [];
        if (this.items) {
            for (let item of this.items) {
                items.push(item.serialize());
            }
        }

        return {
          id: this.id,
          slug: this.slug,
          formulaireDataItems: items
        };
    }

    static serializeArray(details: FormulaireData[]) {
        let result: any[] = [];

        if (details && details.length != 0) {
            for (let detail of details) {
                result.push(detail.serialize());
            }
        }

        return result;
    }
}
