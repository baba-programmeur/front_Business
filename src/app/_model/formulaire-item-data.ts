export class FormulaireItemData {
    private _id: number;
    private _slug: string;
    private _valeur: string;


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

    get valeur(): string {
        return this._valeur;
    }

    set valeur(value: string) {
        this._valeur = value;
    }

    serialize() {
        return {
          id: this.id,
          slug: this.slug,
          valeur: this.valeur
        };
    }
}
