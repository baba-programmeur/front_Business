export class Formulaire {
    private _id: number;
    private _slug: string;
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
            description: this.description
        };
    }
}
