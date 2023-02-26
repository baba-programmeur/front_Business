
export class ConfigurationControleIndicatifs {

    private _id: number;
    private _service: string;
    private _pays: string;
    private _champs: number;
    private _regexp_validation: string;
    private _regexp_prefix: string;
    private _action_prefix_positif: string;
    private _code_erreur_rejet: string;
    private _message_erreur_rejet: string;
    private _active: number;
    private _commentaire: string;
    private _id_profil: number;
    private _type_service: string;
    private _in: string;

    private _indicatif: string ;


    set indicatif(value: string) {
        this._indicatif = value;
    }

    get indicatif(): string {
        return this._indicatif;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get service(): string {
        return this._service;
    }

    set service(value: string) {
        this._service = value;
    }

    get pays(): string {
        return this._pays;
    }

    set pays(value: string) {
        this._pays = value;
    }

    get champs(): number {
        return this._champs;
    }

    set champs(value: number) {
        this._champs = value;
    }

    get regexp_validation(): string {
        return this._regexp_validation;
    }

    set regexp_validation(value: string) {
        this._regexp_validation = value;
    }

    get regexp_prefix(): string {
        return this._regexp_prefix;
    }

    set regexp_prefix(value: string) {
        this._regexp_prefix = value;
    }

    get action_prefix_positif(): string {
        return this._action_prefix_positif;
    }

    set action_prefix_positif(value: string) {
        this._action_prefix_positif = value;
    }

    get code_erreur_rejet(): string {
        return this._code_erreur_rejet;
    }

    set code_erreur_rejet(value: string) {
        this._code_erreur_rejet = value;
    }

    get message_erreur_rejet(): string {
        return this._message_erreur_rejet;
    }

    set message_erreur_rejet(value: string) {
        this._message_erreur_rejet = value;
    }

    get active(): number {
        return this._active;
    }

    set active(value: number) {
        this._active = value;
    }

    get commentaire(): string {
        return this._commentaire;
    }

    set commentaire(value: string) {
        this._commentaire = value;
    }

    get id_profil(): number {
        return this._id_profil;
    }

    set id_profil(value: number) {
        this._id_profil = value;
    }

    get type_service(): string {
        return this._type_service;
    }

    set type_service(value: string) {
        this._type_service = value;
    }

    get in(): string {
        return this._in;
    }

    set in(value: string) {
        this._in = value;
    }

}










