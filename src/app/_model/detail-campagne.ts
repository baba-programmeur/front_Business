export class DetailCampagne {
    private _bank: string;
    private _canal: string;
    private _code: string;
    private _com: string;
    private _datePaiement: string;
    private _dateenvoi: string;
    private _ech: string;
    private _errorMessage: string;
    private _esp: string;
    private _heureenvoi: string;
    private _id: number;
    private _idclt: string;
    private _idfct: string;
    private _mailclt: string;
    private _mnt: string;
    private _motif: string;
    private _nbsms: number;
    private _nomclt: string;
    private _numeroCompte: string;
    private _numeroPiece: string;
    private _partner: string;
    private _payer: string;
    private _pays: string;
    private _paysIdId: number;
    private _prenomclt: string;
    private _referenceId: number;
    private _supporterFrais: string;
    private _telclt: string;
    private _txtsms: string;
    private _typeCanal: string;
    private _typePiece: string;
    private _typeclt: string;
    private _verser: string;


    get bank(): string {
        return this._bank;
    }

    set bank(value: string) {
        this._bank = value;
    }

    get canal(): string {
        return this._canal;
    }

    set canal(value: string) {
        this._canal = value;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get com(): string {
        return this._com;
    }

    set com(value: string) {
        this._com = value;
    }

    get datePaiement(): string {
        return this._datePaiement;
    }

    set datePaiement(value: string) {
        this._datePaiement = value;
    }

    get dateenvoi(): string {
        return this._dateenvoi;
    }

    set dateenvoi(value: string) {
        this._dateenvoi = value;
    }

    get ech(): string {
        return this._ech;
    }

    set ech(value: string) {
        this._ech = value;
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    set errorMessage(value: string) {
        this._errorMessage = value;
    }

    get esp(): string {
        return this._esp;
    }

    set esp(value: string) {
        this._esp = value;
    }

    get heureenvoi(): string {
        return this._heureenvoi;
    }

    set heureenvoi(value: string) {
        this._heureenvoi = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get idclt(): string {
        return this._idclt;
    }

    set idclt(value: string) {
        this._idclt = value;
    }

    get idfct(): string {
        return this._idfct;
    }

    set idfct(value: string) {
        this._idfct = value;
    }

    get mailclt(): string {
        return this._mailclt;
    }

    set mailclt(value: string) {
        this._mailclt = value;
    }

    get mnt(): string {
        return this._mnt;
    }

    set mnt(value: string) {
        this._mnt = value;
    }

    get motif(): string {
        return this._motif;
    }

    set motif(value: string) {
        this._motif = value;
    }

    get nbsms(): number {
        return this._nbsms;
    }

    set nbsms(value: number) {
        this._nbsms = value;
    }

    get nomclt(): string {
        return this._nomclt;
    }

    set nomclt(value: string) {
        this._nomclt = value;
    }

    get numeroCompte(): string {
        return this._numeroCompte;
    }

    set numeroCompte(value: string) {
        this._numeroCompte = value;
    }

    get numeroPiece(): string {
        return this._numeroPiece;
    }

    set numeroPiece(value: string) {
        this._numeroPiece = value;
    }

    get partner(): string {
        return this._partner;
    }

    set partner(value: string) {
        this._partner = value;
    }

    get payer(): string {
        return this._payer;
    }

    set payer(value: string) {
        this._payer = value;
    }

    get pays(): string {
        return this._pays;
    }

    set pays(value: string) {
        this._pays = value;
    }

    get paysIdId(): number {
        return this._paysIdId;
    }

    set paysIdId(value: number) {
        this._paysIdId = value;
    }

    get prenomclt(): string {
        return this._prenomclt;
    }

    set prenomclt(value: string) {
        this._prenomclt = value;
    }

    get referenceId(): number {
        return this._referenceId;
    }

    set referenceId(value: number) {
        this._referenceId = value;
    }

    get supporterFrais(): string {
        return this._supporterFrais;
    }

    set supporterFrais(value: string) {
        this._supporterFrais = value;
    }

    get telclt(): string {
        return this._telclt;
    }

    set telclt(value: string) {
        this._telclt = value;
    }

    get txtsms(): string {
        return this._txtsms;
    }

    set txtsms(value: string) {
        this._txtsms = value;
    }

    get typeCanal(): string {
        return this._typeCanal;
    }

    set typeCanal(value: string) {
        this._typeCanal = value;
    }

    get typePiece(): string {
        return this._typePiece;
    }

    set typePiece(value: string) {
        this._typePiece = value;
    }

    get typeclt(): string {
        return this._typeclt;
    }

    set typeclt(value: string) {
        this._typeclt = value;
    }

    get verser(): string {
        return this._verser;
    }

    set verser(value: string) {
        this._verser = value;
    }

    serialize() {
        return {
            bank: this.bank,
            canal: this.canal,
            code: this.code,
            com: this.com,
            datePaiement: this.datePaiement,
            dateenvoi: this.dateenvoi,
            ech: this.ech,
            errorMessage: this.errorMessage,
            esp: this.esp,
            heureenvoi: this.heureenvoi,
            id: this.id,
            idclt: this.idclt,
            idfct: this.idfct,
            mailclt: this.mailclt,
            mnt: this.mnt,
            motif: this.motif,
            nbsms: this.nbsms,
            nomclt: this.nomclt,
            numeroCompte: this.numeroCompte,
            numeroPiece: this.numeroPiece,
            partner: this.partner,
            payer: this.payer,
            pays: this.pays,
            paysIdId: this.paysIdId,
            prenomclt: this.prenomclt,
            referenceId: this.referenceId,
            supporterFrais: this.supporterFrais,
            telclt: this.telclt,
            txtsms: this.txtsms,
            typeCanal: this.typeCanal,
            typePiece: this.typePiece,
            typeclt: this.typeclt,
            verser: this.verser
        };
    }
}
