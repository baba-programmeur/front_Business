import {ChampValidation} from './champ-validation';

export class Champ {
    private _id: number;
    private _slug: string;
    private _label: string;
    private _type: string;
    private _optionsType: string;
    private _optionsValue: string;
    private _placeholder: string;
    private _depends_on_field_tag: string;
    private _depends_on_field_value: string;
    private _visible: boolean;
    private _readonly: boolean;
    private _formulaireItemId: number;
    private _validations: ChampValidation[];

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

    get label(): string {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get optionsType(): string {
        return this._optionsType;
    }

    set optionsType(value: string) {
        this._optionsType = value;
    }

    get optionsValue(): string {
        return this._optionsValue;
    }

    set optionsValue(value: string) {
        this._optionsValue = value;
    }

    get placeholder(): string {
        return this._placeholder;
    }

    set placeholder(value: string) {
        this._placeholder = value;
    }

    get depends_on_field_tag(): string {
        return this._depends_on_field_tag;
    }

    set depends_on_field_tag(value: string) {
        this._depends_on_field_tag = value;
    }

    get depends_on_field_value(): string {
        return this._depends_on_field_value;
    }

    set depends_on_field_value(value: string) {
        this._depends_on_field_value = value;
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
    }

    get readonly(): boolean {
        return this._readonly;
    }

    set readonly(value: boolean) {
        this._readonly = value;
    }

    get formulaireItemId(): number {
        return this._formulaireItemId;
    }

    set formulaireItemId(value: number) {
        this._formulaireItemId = value;
    }

    get validations(): ChampValidation[] {
        return this._validations;
    }

    set validations(value: ChampValidation[]) {
        this._validations = value;
    }

    serialize() {
        let validations = [];

        if (this.validations) {
            for (let item of this.validations) {
                validations.push(item.serialize());
            }
        }

        return {
            id: this.id,
            slug: this.slug,
            label: this.label,
            type: this.type,
            optionsType: this.optionsType,
            optionsValue: this.optionsValue,
            placeholder: this.placeholder,
            depends_on_field_tag: this.depends_on_field_tag,
            depends_on_field_value: this.depends_on_field_value,
            visible: this.visible,
            readonly: this.readonly,
            formulaireItemId: this.formulaireItemId,
            validations: validations,
        };
    }
}
