import {Plage} from './plage';
import {ProfilFrais} from './profil-frais';

export class ProfilFraisPartenaire {
    private _profilFrais: ProfilFrais;
    private _plages: Plage[];


    get profilFrais(): ProfilFrais {
        return this._profilFrais;
    }

    set profilFrais(value: ProfilFrais) {
        this._profilFrais = value;
    }

    get plages(): Plage[] {
        return this._plages;
    }

    set plages(value: Plage[]) {
        this._plages = value;
    }

    public serialize() {
        return {
            profilFrais: this.profilFrais.serialize(),
            plages: Plage.serializeArray(this.plages)
        }
    }
}
