import {FormulaireData} from './formulaire-data';

export class CampagnePartenaire {

    private _nomCampagne: string;
    private _montantTotal: number;
    private _fraisTotal: number;
    private _canal: string;
    private _typeCanal: string;
    private _nbClients: number;
    private _canal_id: number;



    private _details: FormulaireData[];
    private _notification: boolean;
    get canal_id(): number {
        return this._canal_id;
    }

    set canal_id(value: number) {
        this._canal_id = value;
    }

    get nbClients(): number {
        return this._nbClients;
    }

    set nbClients(value: number) {
        this._nbClients = value;
    }

    get nomCampagne(): string {
        return this._nomCampagne;
    }

    set nomCampagne(value: string) {
        this._nomCampagne = value;
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

    get montantTotal(): number {
        return this._montantTotal;
    }

    set montantTotal(value: number) {
        this._montantTotal = value;
    }

    get details(): FormulaireData[] {
        return this._details;
    }

    set details(value: FormulaireData[]) {
        this._details = value;
    }

    get notification(): boolean {
        return this._notification;
    }

    set notification(value: boolean) {
        this._notification = value;
    }


    get fraisTotal(): number {
        return this._fraisTotal;
    }

    set fraisTotal(value: number) {
        this._fraisTotal = value;
    }

    serialize() {
        return {
            nomCampagne: this.nomCampagne,
            montantTotal: this.montantTotal,
            fraisTotal: this.fraisTotal,
            notification: this.notification,
            canal: this.canal,
            typeCanal: this.typeCanal,
            nbClients : this.nbClients,
            canal_id : this.canal_id,
            details: FormulaireData.serializeArray(this.details)
        }
    }
}
