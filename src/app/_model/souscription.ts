export class Souscription {
    private _id: number;
    private _codees: string;
    private _nomes: string;
    private _raisonSocial: string;
    private _prenom: string;
    private _nom: string;
    private _adresse: string;
    private _agent: string;
    private _cgu: string;
    private _date: string;
    private _email: string;
    private _fixe: string;
    private _fraisId: number;
    private _mobile: string;
    private _ninea: string;
    private _numeroid: string;
    private _pays: string;
    private _rc: string;
    private _secteur: string;
    private _serveur: string;
    private _type: string;
    private _typeid: string;
    private _ville: string;
    private _solde: number;
    private _consomme: number;

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get codees(): string {
        return this._codees;
    }

    set codees(value: string) {
        this._codees = value;
    }

    get nomes(): string {
        return this._nomes;
    }

    set nomes(value: string) {
        this._nomes = value;
    }

    get raisonSocial(): string {
        return this._raisonSocial;
    }

    set raisonSocial(value: string) {
        this._raisonSocial = value;
    }

    get prenom(): string {
        return this._prenom;
    }

    set prenom(value: string) {
        this._prenom = value;
    }

    get nom(): string {
        return this._nom;
    }

    set nom(value: string) {
        this._nom = value;
    }

    get adresse(): string {
        return this._adresse;
    }

    set adresse(value: string) {
        this._adresse = value;
    }

    get agent(): string {
        return this._agent;
    }

    set agent(value: string) {
        this._agent = value;
    }

    get cgu(): string {
        return this._cgu;
    }

    set cgu(value: string) {
        this._cgu = value;
    }

    get date(): string {
        return this._date;
    }

    set date(value: string) {
        this._date = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get fixe(): string {
        return this._fixe;
    }

    set fixe(value: string) {
        this._fixe = value;
    }

    get fraisId(): number {
        return this._fraisId;
    }

    set fraisId(value: number) {
        this._fraisId = value;
    }

    get mobile(): string {
        return this._mobile;
    }

    set mobile(value: string) {
        this._mobile = value;
    }

    get ninea(): string {
        return this._ninea;
    }

    set ninea(value: string) {
        this._ninea = value;
    }

    get numeroid(): string {
        return this._numeroid;
    }

    set numeroid(value: string) {
        this._numeroid = value;
    }

    get pays(): string {
        return this._pays;
    }

    set pays(value: string) {
        this._pays = value;
    }

    get rc(): string {
        return this._rc;
    }

    set rc(value: string) {
        this._rc = value;
    }

    get secteur(): string {
        return this._secteur;
    }

    set secteur(value: string) {
        this._secteur = value;
    }

    get serveur(): string {
        return this._serveur;
    }

    set serveur(value: string) {
        this._serveur = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get typeid(): string {
        return this._typeid;
    }

    set typeid(value: string) {
        this._typeid = value;
    }

    get ville(): string {
        return this._ville;
    }

    set ville(value: string) {
        this._ville = value;
    }

    get solde(): number {
        return this._solde;
    }

    set solde(value: number) {
        this._solde = value;
    }

    get consomme(): number {
        return this._consomme;
    }

    set consomme(value: number) {
        this._consomme = value;
    }

    serialize() {
        return {
            id: this.id,
            codees: this.codees,
            nomes: this.nomes,
            raisonSocial: this.raisonSocial,
            prenom: this.prenom,
            nom: this.nom,
            adresse: this.adresse,
            agent: this.agent,
            cgu: this.cgu,
            date: this.date,
            email: this.email,
            fixe: this.fixe,
            fraisId: this.fraisId,
            mobile: this.mobile,
            ninea: this.ninea,
            numeroid: this.numeroid,
            pays: this.pays,
            rc: this.rc,
            secteur: this.secteur,
            serveur: this.serveur,
            type: this.type,
            typeid: this.typeid,
            ville: this.ville,
            solde: this.solde,
            consomme: this.consomme
        };
    }
}
