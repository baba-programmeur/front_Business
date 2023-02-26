import readXlsxFile from 'read-excel-file';
import {DetailCampagneError} from '../../_model/detail-campagne-error';
import {CommunService} from './commun.service';
import * as XLSX from 'xlsx';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ServerService} from '../auth/server.service';
import {Injectable} from '@angular/core';
import {catchError, map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ErrorHandlerService} from '../auth/error-handler.service';
import {FormulaireData} from '../../_model/formulaire-data';
import {FormulaireItemData} from '../../_model/formulaire-item-data';
import moment = require('moment');


@Injectable()
export class FileService {
    static actionPrefixPositif: any;
    static country: any;
    static service: any;
    static montantMin: number;
    static montantMax: number;
    static typeCampagne: string;
    static regex_numero: any;
    static regex_indicatif: any;
    static indicatif: any;
    static message_erreur: any;
    static min_size_auth: any;
    static max_size_auth: any;
    static isActive: any;

    constructor(private http: HttpClient,
        private errorHandlerService: ErrorHandlerService) {
}
    

    static toLowerAndDeleteSpace(val: string) {
        val = val.toLowerCase();
        val = val.replace(/\s/g, '');

        return val;
    }

    static getPosition(col, entete: any[]) {
        if (entete) {
            const nb = entete.length;
            for (let i = 0; i < nb; i++) {
                if (col === FileService.toLowerAndDeleteSpace(entete[i])) {
                    return i;
                }
            }
        }
        return null;
    }

    static formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [day, month, year].join('/');
    }

    
   static checkIndicatif(indicatif: string): boolean {
    let retour = false;
    let new_tab = this.regex_indicatif;

    // console.log("this.regex_indicatif " , this.regex_indicatif )

    JSON.parse(new_tab).forEach(x => {
    //   console.log("________ indicatif trouve 1",x);
    //   console.log("________ indicatif chekcked",indicatif);
   
            if (x === indicatif) {
                retour = true;
              }
        })
      
    return retour;
  }


    static toDetailsCampagne(data: any[], typeCampagne, champs: any[], rightEntete: string[], profilFraisCourant: any, montantMax: number, montantMin: number) {
        data = data.filter(e => e.length !== 0);
        // console.log('-------------- DATA --------------');
        console.log(data);
        this.montantMax = montantMax;
        this.montantMin = montantMin;
        this.typeCampagne = typeCampagne;
        if (!data || data.length - 1 > 10000 || data.length === 0) {
            /*return {
                donnees: data
            };*/
            return {
                message: 'Le fichier ne doit pas depasser 10000 lignes'
            };
        }
        else {
             if (JSON.stringify(rightEntete).toLowerCase() !== JSON.stringify(data[0]).toLowerCase()) {
                 console.log('----------------- Le message de retour -------------------');
                return {
                    message: 'Le fichier n\'est pas conforme. Merci de télécharger le bon modéle.'
                };
             } else {
                 let montantTotal = 0;
                 let frais = 0;
                 const errors: any[] = [];
                 let nbSMS = 0;
                 let nbEmail = 0;

                 const details: FormulaireData[] = [];
                 let entete = null;

                 if (data && data.length > 1 && data[1].length !== 0) {
                     entete = data[0];

                     for (let i = 1; i < data.length; i++) {
                         if (data[i].length !== 0) {
                             const formulaireData = new FormulaireData();
                             formulaireData.items = [];
                             formulaireData.slug = typeCampagne;

                             const detail: any[] = data[i];

                             for (let j = 0; j < detail.length; j++) {
                                 const formulaireDataItem = new FormulaireItemData();
                                 // console.log('----------- SLUG --------------');
                                 // console.log(FileService.labelToSlugChamp(champs, entete[j]));
                                 formulaireDataItem.slug = FileService.labelToSlugChamp(champs, entete[j]);
                                 formulaireDataItem.valeur = detail[j];

                                 // Traitement date

                                 if (formulaireDataItem.slug === 'echeance') {
                                     const UNIX_DATE = new Date((detail[j] - 25569) * 86400 * 1000);
                                     let date = CommunService.completeTwo(UNIX_DATE.getDate()) + '/';
                                     date += CommunService.completeTwo(UNIX_DATE.getMonth() + 1) + '/';
                                     date += UNIX_DATE.getFullYear();
                                     formulaireDataItem.valeur = date;
                                 }

                                    // console.log("this.typeCampagne ***____",this.typeCampagne)

                                 if(formulaireData.slug && formulaireDataItem.slug.toLowerCase() === 'telephone' && this.typeCampagne.toLowerCase()==='decaissement'){
                               
                                    let value = formulaireDataItem.valeur;
                                    
                                    // console.log("****************** convert datatype *****************")
                                    // console.log("before : typeof value = ", typeof value)
                                     value = typeof value === 'string' ? value : String(value) ;
                                    // console.log("after : typeof value = ", typeof value)
                                    // console.log("****************** convert datatype *****************")
                                    let size_number = Number(value.length);

                                    console.log("************** data from API **************")

                                    // console.log("FileService.regex_numero" , localStorage.getItem('regex_numero'))
                                    
                                    console.log("regex_numero" , this.regex_numero =  new RegExp(localStorage.getItem('regex_numero')))
                                    console.log("regex_indicatif" , this.regex_indicatif = localStorage.getItem('regex_indicatif'))
                                    console.log("indicatif" , this.indicatif = localStorage.getItem('indicatif'))
                                    console.log("message_erreur" , this.message_erreur = localStorage.getItem('message_erreur'))
                                    console.log("min_size_auth" , this.min_size_auth = localStorage.getItem('min_size_auth'))
                                    console.log("max_size_auth" , this.max_size_auth = localStorage.getItem('max_size_auth'))
                                    console.log("isActive" , this.isActive = localStorage.getItem('isActive'))

                                    console.log("************** data from API **************")

                                   if(Number(value.length) === Number(this.min_size_auth)){

                                        if(this.regex_numero.test(value)){ // value = numero
                                            formulaireDataItem.valeur = this.indicatif.concat(formulaireDataItem.valeur);
                                        }
                                    }
                                    else if((this.checkIndicatif(value.substr(0, (size_number - Number(this.min_size_auth))))
                                              && (size_number > Number(this.min_size_auth)))){

                                    let restant_numero = value.substr( value.substr(0, (size_number - Number(this.min_size_auth))).length ,size_number);
                                    formulaireDataItem.valeur = this.indicatif.concat(restant_numero);

                                    }

                                 }

                                 if (formulaireDataItem.slug && formulaireDataItem.slug.toLowerCase() === 'montant') {
                                     console.log("***** Test if montant isN");
                                     console.log(formulaireDataItem.valeur );
                                     console.log(typeof formulaireDataItem.valeur );
                                     console.log(typeof +formulaireDataItem.valeur );
                                     console.log("***** Test modulo");
                                     console.log(+formulaireDataItem.valeur % 1);

                                     if(isNaN(+formulaireDataItem.valeur) || +formulaireDataItem.valeur % 1 != 0 )
                                     {
                                         console.log("***** Montant isNaN");
                                         return {
                                             message: 'Le fichier contient un montant qui n\'est pas un nombre entier, merci de corriger. (Montant : '+formulaireDataItem.valeur+' )'
                                         };
                                     }else{
                                         console.log("***** Montant isN");
                                         montantTotal += +formulaireDataItem.valeur;
                                         frais += CommunService.calculerFraisCampagne(formulaireDataItem.valeur, profilFraisCourant);
                                     }
                                 }

                                 if(formulaireDataItem.slug && (formulaireDataItem.slug.toLowerCase().includes('echeance') || formulaireDataItem.slug.toLowerCase().includes('date') )){
                                     console.log('********* colonne date ********');
                                     console.log('init date '+formulaireDataItem.valeur);
                                    var isValidDate = moment(formulaireDataItem.valeur,"DD/MM/YYYY").isValid();
                                     console.log('********* date : '+formulaireDataItem.valeur);
                                     console.log('********* isValid return : '+isValidDate);
                                    if (isValidDate == false){
                                        console.log('*********return errors echeanceFormat : '+isValidDate);
                                        let detailError = new DetailCampagneError();
                                        detailError = FileService.isValid('echeanceFormat', formulaireDataItem.valeur, detailError);
                                        errors.push({ligne: i + 1, error: detailError});
                                        console.log('error : '+JSON.stringify(errors));

                                    }else {
                                        formulaireDataItem.valeur = moment(formulaireDataItem.valeur,"DD/MM/YYYY").format("DD/MM/YYYY");
                                        console.log("date convert : "+formulaireDataItem.valeur)
                                    }
                                 }

                                 // tslint:disable-next-line:max-line-length
                                 if (formulaireDataItem.slug && formulaireDataItem.slug === 'notif_sms' && formulaireDataItem.valeur && formulaireDataItem.valeur.toLowerCase() === 'oui') {
                                     nbSMS++;
                                 }

                                 // tslint:disable-next-line:max-line-length
                                 if (formulaireDataItem.slug && formulaireDataItem.slug === 'notif_email' && formulaireDataItem.valeur && formulaireDataItem.valeur.toLowerCase() === 'oui') {
                                     nbEmail++;
                                 }
                                   formulaireData.items.push(formulaireDataItem);
                             }

                             // transformation en details
                             const test = FileService.formulaireDataToDetails(formulaireData);
                             if (!test) {
                                 console.log('NOT CORRECT FILE');
                             }

                             console.log("test containes : "+test.echeance)
                             const result = FileService.validateDetail(test, typeCampagne);
                             if (!FileService.isEmpty(result)) {
                                 errors.push({ligne: i + 1, error: result});
                             }
                             // console.log(formulaireData);
                             details.push(formulaireData);
                         }
                     }
                     // console.log('____ data');
                     // console.log(details);
                 }

                 return {
                     entete: entete,
                     details: details,
                     montantTotal: montantTotal,
                     clients: details.length,
                     errors: errors,
                     nbSMS: nbSMS,
                     nbEmail: nbEmail,
                     frais: frais
                 };
             }
        }
    }

    static validateDetail(detailCampagne: any, typeCampagne) {
        // console.log('Type campagne correspondant: ', typeCampagne);
        let detailError = new DetailCampagneError();
        // console.log("detailsCampagne in validateDetail() in fileservicets : " + JSON.stringify(detailCampagne));
        detailError = FileService.isValid('idclient', detailCampagne.idclient, detailError);
        detailError = FileService.isValid('prenom', detailCampagne.prenom, detailError);
        detailError = FileService.isValid('nom', detailCampagne.nom, detailError);
        detailError = FileService.isValid('notifSms', detailCampagne.notif_sms, detailError);
        detailError = FileService.isValid('notifEmail', detailCampagne.notif_email, detailError);
        detailError = FileService.isValid('motif', detailCampagne.motif, detailError);
        detailError = FileService.isValid('telephone', detailCampagne.telephone, detailError);

        

        //detailError = FileService.isValid('echeance', detailCampagne.echeance, detailError);

        if (detailCampagne.notif_email && detailCampagne.notif_email.toLowerCase() === 'oui') {
            detailError = FileService.isValid('email', detailCampagne.email, detailError);
        }
        // if (detailCampagne.notif_sms && detailCampagne.notif_sms.toLowerCase() === 'oui') {
        //     detailError = FileService.isValid('telephone', detailCampagne.telephone, detailError);
        // }
        detailError = FileService.isValid('montant', detailCampagne.montant, detailError);
        detailError = FileService.isValid('echeance', detailCampagne.echeance, detailError);
        if (typeCampagne.toUpperCase() === 'ENCAISSEMENT') {
            detailError = FileService.isValid('numero_facture', detailCampagne.numero_facture, detailError);
        }
        return detailError;
    }

    static formulaireDataToDetails(formulaireData: FormulaireData) {
        const result: any = {};
        const res = formulaireData.serialize();
        for (const item of res.formulaireDataItems) {
            result[item.slug] = item.valeur;
        }
        return result;
    }

    static labelToSlugChamp(champs: any[], label) {
        const result = champs.filter(e => e.label.toLowerCase().trim() === label.toLowerCase().trim());
        if (result && result.length !== 0) {
            return result[0].slug
        } else {
            return label;
        }
    }

    static isValid(libelle, value, detailError: DetailCampagneError): DetailCampagneError {
        switch (libelle) {
            case 'idclient':
                if (!value || value === '') {
                    detailError.idClient = 'L\'id du client est obligatoire.';
                }
                break;
            case 'prenom':
                if (!value || value === '') {
                    detailError.prenom = 'Le prénom du client est obligatoire.';
                }
                break;
            case 'nom':
                if (!value || value === '') {
                    detailError.nom = 'Le nom du client est obligatoire.';
                }
                break;
            case 'motif':
                if (!value || value === '') {
                    detailError.nom = 'Le motif est obligatoire.';
                }
                break;
            case 'email':
                if (!value || value === '') {
                    detailError.mail = 'Le mail du client est obligatoire.';
                } else {
                    if (!value.match('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')) {
                        detailError.mail = 'Le mail du client n\'est pas correct.';
                    }
                }
                break;
            case 'telephone':
                // console.log("********** value ************")
                console.log(value)
                // console.log("before conversion : typeof value = ", typeof value)

                // conversion de numero number en string
                value = typeof value === 'string' ? value : String(value) ;

                // console.log("after conversion : typeof value = ", typeof value)

                // console.log("********** end value ************")

                let _size_number =  value.length;


                if (!value || value === '' || value === null) {
                    detailError.telephone = 'Le téléphone du client est obligatoire.';break;
                }else if (!FileService.isNumeric(value)) {
                    detailError.telephone = 'Le téléphone ne doit contenir que des nombres.';break;
                }else  
                    if(this.typeCampagne.toLowerCase()==='decaissement'){
                        if(_size_number > Number(this.max_size_auth)){
                            detailError.telephone = 'la longeur maximale du numero de téléphone autorisé est '+ this.max_size_auth + ' chiffres .';break;
                        }else if(_size_number < Number(this.min_size_auth)){
                            detailError.telephone = 'la longeur minimale du numero de téléphone autorisé est '+ this.min_size_auth + ' chiffres .';break;
                        }else if(!(Number(value.substr((_size_number - Number(this.min_size_auth)),_size_number).length) === Number(this.min_size_auth) && this.regex_numero.test(value.substr((_size_number - Number(this.min_size_auth)),_size_number)))){
                            detailError.telephone = " le format du numero téléphone  " + value + " n'est pas autorisé ";
                            break;
                        }else if(!(this.checkIndicatif(value.substr(0, (_size_number - Number(this.min_size_auth)))) && (_size_number > Number(this.min_size_auth)))){
                            detailError.telephone = " le numéro téléphone  " + value + " avec l'indicatif " + value.substr(0, (_size_number - Number(this.min_size_auth))) + " est incorrect .";
                            break;
                        }
                    }
              
                break;
            case 'notifSms':
                if (value === null || value === '') {
                    detailError.notifSms = 'La notification sms est obligatoire.';
                } else {
                    if (value !== 'NON' && value !== 'OUI' && value !== 'non' && value !== 'oui') {
                        detailError.notifSms = 'La notification sms doit avoir une valeur de OUI ou NON.';
                    }
                }
                break;
            case 'notifEmail':
                if (value === null || value === '') {
                    detailError.notifEmail = 'La notification email est obligatoire.';
                } else {
                    if (value !== 'NON' && value !== 'OUI' && value !== 'non' && value !== 'oui') {
                        detailError.notifEmail = 'La notification email doit avoir une valeur de OUI ou NON.';
                    }
                }
                break;
            case 'montant':
                if (!value || value === '') {
                    detailError.montant = 'Le montant est obligatoire.';
                } else {
                    if (!FileService.isNumeric(value)) {
                        detailError.montant = 'Le montant doit etre un nombre.';
                    } else {
                        if (+value <= 0) {
                            detailError.montant = 'Le montant doit etre strictement positif.';
                        } else {
                            // tslint:disable-next-line:max-line-length
                            if (this.typeCampagne.toLowerCase() === 'decaissement' && this.montantMin && this.montantMax && value && (this.montantMin > +value || this.montantMax < +value)) {
                                // tslint:disable-next-line:max-line-length
                                detailError.montant = 'Le montant doit etre compris entre ' + this.montantMin + ' et ' + this.montantMax + '.';
                            }
                        }
                    }
                }
                break;
            case 'echeance':
                if (!value || value === '') {
                    detailError.echeanceFacture = 'La date d\'échéance est obligatoire.';
                } else {
                    const today = new Date();
                    const tab = value.split('/');
                    // console.log('Date Today : ', today);
                    const ech = new Date(tab[2] + '-' + tab[1] + '-' + tab[0]);
                    // console.log('Date echeance : ', ech);
                    if (today > ech) {
                        detailError.echeanceFacture = 'La date d\'échéance doit etre supérieure à la date d\'aujourd\'hui.';
                    }
                }
                break;
            case 'echeanceFormat':
                        detailError.echeanceFacture = 'Veuillez utiliser le format suivant: Jour/Mois/Annee (Exemple: 19/01/2022)';
                break;
            case 'numero_facture':
                if (!value || value === '') {
                    detailError.echeanceFacture = 'L\'id facture est obligatoire.';
                }
                break;
            default: break;
        }
        return detailError;
    }

    static isNumeric(str) {
        return !isNaN(str);
    }

    static isEmpty(obj) {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    }

    getDetailsCampagneFromFile(file, typeCampagne, champs) {
        return readXlsxFile(file, { sheet: 1 }).then(
            (data) => {
                console.log('______ DATA FROM FILE ____');
                console.log(data);
                return FileService.toDetailsCampagne(data, typeCampagne, champs, null, null, null, null);
            }
        );
    }

    getDetailsCampagneFromFileXL(file, typeCampagne, champs, rightEntete, profilFraisCourant, montantMax, montantMin): Promise<any> {
        const fileRead: FileReader = new FileReader();
        fileRead.readAsBinaryString(file);
        return new Promise((resolve) => {
            fileRead.onloadend = () => {
                const fic: XLSX.WorkBook = XLSX.read(fileRead.result, {type: 'binary'});
                // tslint:disable-next-line:max-line-length
                resolve(FileService.toDetailsCampagne(XLSX.utils.sheet_to_json(fic.Sheets[fic.SheetNames[0]], {header: 1}), typeCampagne, champs, rightEntete, profilFraisCourant, montantMax, montantMin));
            };
        });
    }


    downloadFile(tag) {
        return this.http.get(ServerService.baseUrl + 'formulaires/download/' + tag, { observe: 'response', responseType: 'arraybuffer' })
            .pipe(
                map(response => {
                    return {
                        body: response.body
                    };
                }),
                catchError( res => {
                    const decoder = new TextDecoder('utf-8');
                    res.error = JSON.parse(decoder.decode(res.error));

                    if (res.error.httpStatus && res.error.httpStatus === 'BAD_REQUEST') {
                        this.errorHandlerService.showError(res.error.message, res.error.code, res.error.level);
                    }
                    throw res.error;
                })
            );
    }
}
