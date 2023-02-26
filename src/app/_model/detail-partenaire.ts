export class DetailPartenaire {
    private _idClient: string;
    private _prenom: string;
    private _nom: string;
    private _telephone: string;
    private _mail: string;
    private _montant: number;
    private _typePiece: string;
    private _numeroPiece: string;
    private _echeance: string;
    private _numFacture: string;
    private _numeroCompte: string;
    private _banque : string;
    private _pays: string;
    private _statut: string;
    private _motif: string;
    private _commentaire: string;
    private _canal: string;
    private _typeCanal: string;


    get idClient(): string {
        return this._idClient;
    }

    set idClient(value: string) {
        this._idClient = value;
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

    get telephone(): string {
        return this._telephone;
    }

    set telephone(value: string) {
        this._telephone = value;
    }

    get mail(): string {
        return this._mail;
    }

    set mail(value: string) {
        this._mail = value;
    }

    get montant(): number {
        return this._montant;
    }

    set montant(value: number) {
        this._montant = value;
    }

    get typePiece(): string {
        return this._typePiece;
    }

    set typePiece(value: string) {
        this._typePiece = value;
    }

    get numeroPiece(): string {
        return this._numeroPiece;
    }

    set numeroPiece(value: string) {
        this._numeroPiece = value;
    }

    get banque(): string {
        return this._banque;
    }

    set banque(value: string) {
        this._banque = value;
    }

    get numeroCompte(): string {
        return this._numeroCompte;
    }

    set numeroCompte(value: string) {
        this._numeroCompte = value;
    }

    get echeance(): string {
        return this._echeance;
    }

    set echeance(value: string) {
        this._echeance = value;
    }

    get numFacture(): string {
        return this._numFacture;
    }

    set numFacture(value: string) {
        this._numFacture = value;
    }

    get pays(): string {
        return this._pays;
    }

    set pays(value: string) {
        this._pays = value;
    }

    get statut(): string {
        return this._statut;
    }

    set statut(value: string) {
        this._statut = value;
    }

    get motif(): string {
        return this._motif;
    }

    set motif(value: string) {
        this._motif = value;
    }

    get commentaire(): string {
        return this._commentaire;
    }

    set commentaire(value: string) {
        this._commentaire = value;
    }

    get canal(): string {
        return this._canal;
    }

    set canal(value: string) {
        this._canal = value;
    }

    get typeCanal(): string {
        return this._typeCanal;
    }

    set typeCanal(value: string) {
        this._typeCanal = value;
    }

    serialize() {
        return {
            idClient: this.idClient,
            prenom: this.prenom,
            nom: this.nom,
            telephone: this.telephone,
            mail: this.mail,
            montant: this.montant,
            typePiece: this.typePiece,
            numeroPiece: this.numeroPiece,
            echeance: this.echeance,
            numFacture: this.numFacture,
            pays: this.pays,
            statut: this.statut,
            motif: this.motif,
            commentaire: this.commentaire,
            canal: this.canal,
            typeCanal: this.typeCanal,
            banque: this.banque,
            numeroCompte: this.numeroCompte
        }
    }

    static serializeArray(details: DetailPartenaire[]) {
        let result: any[] = [];

        if (details && details.length != 0) {
            for (let detail of details) {
                result.push(detail.serialize());
            }
        }

        return result;
    }
}
