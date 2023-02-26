export class Parametrage {
    private _id: number;
    private _slug: string;
    private _libelle: string;
    private _description: string;


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

    get libelle(): string {
        return this._libelle;
    }

    set libelle(value: string) {
        this._libelle = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    serialize() {
        return {
            id: this.id,
            slug: this.slug,
            libelle: this.libelle,
            description: this.description,
        };
    }
}
