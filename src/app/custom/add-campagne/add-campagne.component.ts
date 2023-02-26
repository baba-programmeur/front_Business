import {Component, EventEmitter, HostBinding, HostListener, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FileService} from '../../_service/autre/file.service';
import {formatNumber} from '@angular/common';
import {LoaderService} from '../../_service/auth/loader.service';
import {DetailCampagneError} from '../../_model/detail-campagne-error';
import {AddDetailCampagneComponent} from '../details-campagne/add-detail-campagne/add-detail-campagne.component';
import {TypeCanal} from '../../_model/type-canal';
import {Canal} from '../../_model/canal';
import {CanalService} from '../../_service/autre/canal.service';
import {Campagne} from '../../_model/campagne';
import {UserService} from '../../_service/auth/user.service';
import {Compte} from '../../_model/compte';
import {CampagneService} from '../../_service/autre/campagne.service';
import {NotificationService} from '../../_service/autre/notification.service';
import {CampagnePartenaire} from '../../_model/campagne-partenaire';
import {Router} from '@angular/router';
import {FormulaireData} from '../../_model/formulaire-data';
import {FormulaireItemData} from '../../_model/formulaire-item-data';
import {FormulaireService} from '../../_service/autre/formulaire.service';
import {CommunService} from '../../_service/autre/commun.service';
import {parseIntAutoRadix} from '@angular/common/src/i18n/format_number';
import {SouscriptionService} from '../../_service/autre/souscription.service';
import {ProfilFraisService} from '../../_service/autre/profil-frais.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Observable} from 'rxjs';
import { cpuUsage } from 'process';
import { DetailsCampagneComponent } from '../admin/details-campagne/details-campagne.component';

declare var swal: any;

@Component({
    selector: 'app-add-campagne',
    templateUrl: './add-campagne.component.html',
    styleUrls: ['./add-campagne.component.scss']
})
export class AddCampagneComponent implements OnInit {
    isLinear = true;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    selectedFile: File;
    detailsCampagne: FormulaireData[];
    entete: any[];
    typeCampagne: string;
    collectIndiv = null;
    individuel = true;
    general = false;
    canalLibelle: string;
    typeCanalLibelle: string;
    canal_id: number;
    montantMin: number;
    montantMax: number;
    typeCanalId: number;
    nomCampagne: string;
    fileLoaded = false;
    fileIsValid = null;
    nbClients: number;
    montantTotal: string;
    montantTotalString: string;
    fraisTotal: number;
    errors: any[];
    index: number;
    typeCanals: TypeCanal[];
    canals: Canal[];
    p_savedDetail: any = 0;
    saving = false;
    configXLS;
    account: Compte;
    formulaire: any;
    fileErrors = [];
    nbSMS: number;
    nbEmail: number;
    solde: number;
    profilFrais: any[];
    profilFraisCourant: any;
    frais: number;
    montant_total: number;
    montant: number;


    @Output() onFileDropped = new EventEmitter<any>();

    @HostBinding('style.background-color') private background = '#f5fcff';
    @HostBinding('style.opacity') private opacity = '1';
    country: string;
    servie: string;
    regex_indicatif: any;
    regex_numero: RegExp;
    indicatif: any;
    message_erreur: any;
  
    isActive: string[];
    service: string;
    static min_size_auth: any;
    static indicatif: any;
    actionPrefixPositif: any;
    canalLibelle_: string;


    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#9ecbec';
        this.opacity = '0.8'
    }

    constructor(
        public dialog: MatDialog,
        private fileService: FileService,
        private _formBuilder: FormBuilder,
        private loaderService: LoaderService,
        private canalService: CanalService,
        private userService: UserService,
        private formulaireService: FormulaireService,
        private campagneService: CampagneService,
        private router: Router,
        private souscriptionService: SouscriptionService,
        private profilFraisService: ProfilFraisService,
        public dialogRef: MatDialogRef<AddCampagneComponent>,
        private notificationService: NotificationService,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.configXLS = {
            startingRow: 0,
            validation: [
                {
                    fieldName: 'Telephone',
                    validationType: 'text'
                }
            ],
            showAll: true
        };
    }

    ngOnInit() {
        // gestion de l'évolution d'une campagne en terme de pourcentage
        // lors de la génération
        this.notificationService.savedDetailPercent.subscribe(value => {
            this.p_savedDetail = value;
        });

        this.firstFormGroup = this._formBuilder.group({
            typeCampagneCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            nomCampagneCtrl: ['', Validators.required],
            canalCtrl: ['', []],
            typeCanalCtrl: ['', []]
        });

        this.thirdFormGroup = new FormGroup({});
        if (this.router.url.includes('paiement')) {
            this.typeCampagne = 'DECAISSEMENT'
        } else {
            if (this.router.url.includes('collecte')) {
                this.typeCampagne = 'ENCAISSEMENT';
            } else {
                this.typeCampagne = '';
                this.general = true;
            }
        }

        this.account = this.userService.getUserInfo();

        this.rafraichirSolde();
        this.findProfilFrais();
        this.getTypeCanals();
    }

    rafraichirSolde() {
        this.souscriptionService.consulterSolde(this.account.souscription.id)
            .subscribe(
                (resp: any) => {
                    if (resp) {
                        console.log(resp);
                        this.solde = (+resp.solde) - (+resp.consomme);
                        this.userService.setAccountFromStorage(this.account);
                    }
                }
            );
    }

    onSwitchTab(val, event) {
        this.resetFile();
        if (val === 'indiv') {
            this.thirdFormGroup.removeControl('fileCtrl');
            this.thirdFormGroup.removeControl('erreur');
            this.collectIndiv = 'indiv';
            this.individuel = true;
        } else if (val === 'file') {
            this.thirdFormGroup.addControl('fileCtrl', new FormControl('', Validators.required));
            this.thirdFormGroup.addControl('erreur', new FormControl('', Validators.required));
            this.collectIndiv = 'file';
            this.individuel = false;
        } else {
            this.collectIndiv = null;
        }
    }

    resetFile() {
        this.thirdFormGroup.reset();
        this.fileLoaded = false;
        this.selectedFile = null;
        // Reset file
    }

    resetForm() {
        this.thirdFormGroup.removeControl('fileCtrl');
        this.thirdFormGroup.removeControl('erreur');
        this.thirdFormGroup.addControl('fileCtrl', new FormControl('', Validators.required));
        this.thirdFormGroup.addControl('erreur', new FormControl('', Validators.required));
    }

    onDataSaved() {
        console.log('***** In onDataSaved() ')
        if (this.individuel) {
            console.log('***** In Indiviudel == true ')

            const data = this.thirdFormGroup.value;
            console.log('valeur du formulaire');
            console.log(data);
            this.nbClients = 1;
            if (data) {
                if (data.montant) {
                    this.montantTotal = data.montant;
                }

                console.log(' **** datas : ')
                console.log(data)
                const formulaireData = new FormulaireData();
                formulaireData.items = [];

                formulaireData.slug = this.typeCampagne;

                const keys = Object.keys(data);

                for (const key of keys) {
                    const item = new FormulaireItemData();
                    item.slug = key;
                    item.valeur = data[key];

                    if (item.slug === 'echeance') {
                        item.valeur = FileService.formatDate(data[key]);
                    }

                    if (item.slug === 'notif_sms' && item.valeur.toLowerCase() === 'oui') {
                        this.nbSMS = 1;
                    }

                    if (item.slug === 'notif_email' && item.valeur.toLowerCase() === 'oui') {
                        this.nbEmail = 1;
                    }
                    if (item.slug === 'telephone') {
                        let indicatif = "";
                        let pays = localStorage.getItem('c_pays');
                        switch (pays){
                            case 'SEN':  indicatif='221';
                                break;
                            case 'CIV' || 'INT':  indicatif='225';
                                break;
                            case 'MLI': indicatif='225'; 
                                break;

                            default:
                        }
                       

                        item.valeur = indicatif.concat(data[key]);
                        console.log("new numero__________", item.valeur )
                    }

                    if (item.slug === 'montant') {
                        console.log('***** if montant , call CommunService.calculerFraisCampagne()')
                        this.frais = CommunService.calculerFraisCampagne(item.valeur, this.profilFraisCourant);

                        console.log('***** After call CommunService.calculerFraisCampagne() : frais : ' + this.frais)
                    }

                    formulaireData.items.push(item);
                }
                if (this.frais!=null) {
                    const itemfrais = new FormulaireItemData();
                    itemfrais.slug = 'frais';
                    itemfrais.valeur = this.frais.toString();
                    formulaireData.items.push(itemfrais);
                }
                console.log('------ Les elements du formulaire ' + JSON.stringify(formulaireData.items));
                this.detailsCampagne = [formulaireData];
            }
        }
    }

    onFormChange(form) {
        console.log('Le changement de formulaire');
        console.log(form);
        this.thirdFormGroup = form;
    }

    getFrais() {
        console.log('********** In get frais ********')
        // tslint:disable-next-line:max-line-length
        console.log('********* profil frais')
        console.log(this.profilFrais)
        const tab = this.typeCampagne === 'DECAISSEMENT' ? this.profilFrais.filter(x => x.profilFrais.canalLibelle === this.canalLibelle) : this.profilFrais.filter(x => x.profilFrais.typeOperation === this.typeCampagne);
        if (tab.length !== 0) {
            console.log('tab frais != 0')
            this.profilFraisCourant = tab[0];
        } else {
            console.log('tab frais ==  0')
            this.profilFraisCourant = null;
        }
    }

    /**
     * Get type canals
     */
    getTypeCanals() {
        this.canalService.getTypeCanals()
            .subscribe(
                (typeCanals: TypeCanal[]) => {
                    this.typeCanals = typeCanals;
                    console.log('_______ type canal ____');
                    console.log(this.typeCanals);
                }
            );
    }

    findProfilFrais() {

        // console.log("______ this.account ________ ",this.account)
        localStorage.setItem('c_pays',this.account.souscription ? this.account.souscription.pays :'')

        console.log('********* in find profil frais ***********')
        this.profilFraisService.getProfilsFraisBySouscription(this.account.souscription.id)
            .subscribe(
                (resp: any[]) => {
                    if (resp) {
                        console.log('La liste des profils frais', resp);
                        this.profilFrais = resp;
                    }
                }
            )
    }

    /**
     * Get canals
     *
     * @param typeCanalId
     */
    getCanals(typeCanalId, codePays) {
        console.log('___ Type canal id', typeCanalId);
        //pour reinitiliaser la valeur du select 
        this.canals =[];
        this.canalLibelle = '';

        // find type canal libelle
        if (this.typeCanals) {
            for (const type of this.typeCanals) {
                if (type.id === +typeCanalId) {
                    DetailsCampagneComponent.canalLibelle_ = this.typeCanalLibelle = type.libelle;
                    console.log('___ Type canal libelle', this.typeCanalLibelle);
                }
            }
        }

        this.canalService.getCanalsEntite(typeCanalId, codePays)
            .subscribe(
                (canals: any) => {
                    console.log('Liste des canaux recus: ', canals);
                    this.canals = canals;
                }
            );

    }

    /**
     * on select type canal
     */
    onSelectTypeCanal() {
        if (this.typeCanalId) {
            if (this.account.souscription && this.account.souscription.pays) {
                this.getCanals(this.typeCanalId, this.account.souscription.pays);
            } else {
                swal({
                    icon: 'error',
                    text: 'Vous n\'etes pas autoriser à récuperer la liste des canaux. Merci de vérifier votre souscription.'
                });
            }
        }
    }

    getRangeMontant() {
        if (this.individuel && this.thirdFormGroup.valid) {
            // tslint:disable-next-line:max-line-length
            if (this.montantMin && this.montantMax && this.thirdFormGroup.value.montant && (this.montantMin > +this.thirdFormGroup.value.montant || this.montantMax < +this.thirdFormGroup.value.montant)) {
                swal({
                    icon: 'warning',
                    text: 'Le montant doit etre entre ' + this.montantMin + ' et ' + this.montantMax + '.'
                });
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    /**
     * on file selected
     *
     * @param event
     */
    onFileSelected(event: any[]) {
        
        

        this.loaderService.show();
        this.fileErrors = [];

        const rightEntete = [];

        console.log('===================== je suis la : le fichier ======================');
        console.log(event);
        console.log(JSON.stringify(event));

        // this.getInfoIndicatif(this.country,this.service);

        
        if (event && event.length !== 0) {
            this.selectedFile = event[0];

            if (this.selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                this.loaderService.hide();
                swal({
                    icon: 'error',
                    text: 'Le type de fichier n\'est pas accepté.'
                });
                this.resetFile();
                this.resetForm();
            } else {
                if (this.selectedFile.size / 1024 / 1024 > 25) {
                    swal({
                        icon: 'error',
                        text: 'La taille du fichier à dépassé 25 Mbs. Merci d\'utiliser un fichier leger.'
                    });
                    this.resetFile();
                    this.resetForm();
                } else {
                    this.formulaireService.findFormulaireDetails(this.typeCampagne).toPromise()
                        .then(
                            (datas: any) => {
                                console.log("datas : " + JSON.stringify(datas))
                                const champs = [];
                                for (const formData of datas.formulaireItems) {
                                    for (const formChamps of formData.champs) {
                                        champs.push(formChamps);
                                        if (formChamps.visible) {
                                            rightEntete.push(formChamps.label);
                                        }
                                    }
                                }
                                // tslint:disable-next-line:max-line-length
                                this.fileService.getDetailsCampagneFromFileXL(this.selectedFile, this.typeCampagne, champs, rightEntete, this.profilFraisCourant, this.montantMax, this.montantMin)
                                    .then(
                                        (result: any) => {
                                             console.log("result : " + JSON.stringify(result))

                                            let profilFraisCourantHere = this.profilFraisCourant;
                                            console.log('-------- Données du fichier');
                                            console.log(result);
                                            this.loaderService.hide();
                                            if (result.donnees) {
                                                if (result.donnees.length === 0) {
                                                    swal({
                                                        icon: 'error',
                                                        text: 'Merci de remplir le fichier. Il ne contient pas de données.'
                                                    });
                                                    this.resetFile();
                                                    this.resetForm();
                                                } else {
                                                    if (result.donnees.length - 1 > 50) {
                                                        swal({
                                                            icon: 'error',
                                                            text: 'La taille maximum (50) autorisé est dépassée.'
                                                        });
                                                        this.resetFile();
                                                        this.resetForm();
                                                    }
                                                }
                                            } else {
                                                if (result.message) {
                                                    swal({
                                                        icon: 'error',
                                                        text: result.message
                                                    });
                                                    this.resetFile();
                                                    this.resetForm();
                                                } else {
                                                    // TODO: verifier la duplication des clients avec idfacture et idclient
                                                    console.log('---------- Details ----------');
                                                    // tslint:disable-next-line:max-line-length
                                                    const tabEntities = this.campagneService.detailsToEntities(result.details, this.typeCampagne);
                                                    console.log(tabEntities);
                                                    // tslint:disable-next-line:max-line-length
                                                    if (this.campagneService.containsDoublons(tabEntities, 'idclient', 'numero_facture', 'numero_piece', this.typeCampagne)) {
                                                        swal({
                                                            icon: 'error',
                                                            text: 'Le fichier contient des doublons. Merci de corriger et reessayer'
                                                        });
                                                        this.resetFile();
                                                    } else {
                                                        if (result.entete == null) {

                                                            console.log('________ Erreur de chargement d\'un fichier vide _______');
                                                            swal({
                                                                icon: 'error',
                                                                text: 'Impossible de charger un fichier vide ! '
                                                            });
                                                            // this.loaderService.hide();
                                                            this.deleteAttachment(event);
                                                            this.resetFile();
                                                            this.resetForm();
                                                        } else {
                                                            this.entete = result.entete;
                                                            // console.log('--------------------- Toure---------------')
                                                            // console.log('this.entete ' + this.entete)
                                                            // console.log('result.entete ' + result.entete)
                                                            console.log('---- entete ');
                                                            // console.log('--------------------- Toure---------------')

                                                            this.entete.push('Frais');

                                                            this.detailsCampagne = result.details;
                                                            console.log('---- details campagne containt : ');

                                                            this.detailsCampagne.forEach(function (value) {

                                                                let lignes = [];
                                                                lignes = value.items;
                                                                console.log('---- Items in Values : ');
                                                                console.log(lignes);
                                                                lignes.forEach(function (ligne) {
                                                                    /* let ligneFrais = {_slug : '',
                                                                                       _valeur :''};*/

                                                                    // if(ligne._slug === 'telephone'){

                                                                    //     console.log("______ numero recu from add-campagne-component " + ligne._valeur)

                                                                    //     let numero = ligne._valeur.toString();
                                                                    //     let size_number = numero.length;

                                                                    //     if(size_number > 9 && size_number <= 14){
                                                                               
                                                                    //         console.log("___ AddCampagneComponent.min_size_auth",AddCampagneComponent.min_size_auth)
                                                                    //         console.log("___ AddCampagneComponent.max_size_auth",AddCampagneComponent.max_size_auth)
                                                                    //         console.log("___indicatif",numero.substr(0, (size_number - Number(AddCampagneComponent.min_size_auth))))
                                                                    //         console.log("___restant numero ",numero.substr( numero.substr(0, (size_number - Number(AddCampagneComponent.min_size_auth))).length ,size_number))

                                                                    //         let restant_numero = numero.substr( numero.substr(0, (size_number - Number(AddCampagneComponent.min_size_auth))).length ,size_number);
                                                                    //         console.log("indicatif ",AddCampagneComponent.indicatif )
                                                                    //             ligne._valeur = AddCampagneComponent.indicatif.concat(restant_numero);
                                                                    //         }
                                                                    
                                                                // }

                                                                    console.log('+++++++ ligne.slug : ')
                                                                    console.log(ligne._slug)
                                                                    if (ligne._slug == 'montant') {
                                                                        const itemfrais = new FormulaireItemData();
                                                                        console.log('***** if montant , call CommunService.calculerFraisCampagne()')
                                                                        let fraisLigne: any;
                                                                        fraisLigne = CommunService.calculerFraisCampagne(ligne._valeur, profilFraisCourantHere);
                                                                        console.log('+++++++ frais: ')
                                                                        console.log(ligne._slug)
                                                                        itemfrais.slug = 'frais';
                                                                        itemfrais.valeur = fraisLigne.toString();
                                                                        lignes.push(itemfrais);
                                                                    }
                                                                    console.log('---- Apres ajout ligne frais  : ');
                                                                    console.log("lignes apres traitement " , lignes);
                                                                })
                                                            })
                                                            console.log('++++++++ details Campagne apres ajout frais : ')
                                                            console.log(this.detailsCampagne);
                                                            this.nbClients = result.clients;
                                                            this.nbSMS = result.nbSMS;
                                                            this.nbEmail = result.nbEmail;
                                                            this.montant_total = result.montantTotal;
                                                            console.log('-------- Montant Befor format : ' + result.montantTotal)
                                                            //this.montantTotal = formatNumber(result.montantTotal, 'fr-FR');
                                                            this.montantTotal = result.montantTotal.toString();
                                                            console.log('-------- type de montantTotal ');
                                                            console.log(typeof this.montantTotal);
                                                            console.log('-------- Montant After format : ' + this.montantTotal)
                                                            this.frais = result.frais;
                                                            console.log('-------- Montant frais : ' + this.frais)

                                                            this.fileLoaded = true;
                                                            // handle errors
                                                            this.errors = result.errors;
                                                            this.index = 0;

                                                            if (this.errors && this.errors.length !== 0) {
                                                                console.log(this.errors);
                                                                this.handleErrors(this.errors, this.index)
                                                            } else {
                                                                this.thirdFormGroup.controls['erreur'].setValue('ok');
                                                                this.fileIsValid = 'oui';
                                                                this.thirdFormGroup = new FormGroup({});
                                                            }
                                                        }
                                                    }
                                                }

                                            }
                                            // TODO : mettre icic les traitements du fichier
                                        },
                                        error => {
                                            this.loaderService.hide();
                                            console.log('________ Error on load file _______');
                                            console.log(error);
                                            swal({
                                                icon: 'error',
                                                text: 'Impossible de charger le fichier'
                                            });
                                        }
                                    );
                            }
                        )
                }
            }
        }
    }

    terminer() {
        swal({
            text: 'Souhaitez-vous poursuivre la campagne ?',
            closeOnClickOutside: false,
            buttons: {
                cancel: {
                    text: 'NON',
                    value: false,
                    visible: true,
                    className: 'cancel',
                    closeModal: true,
                    position: 'middle'
                },
                confirm: {
                    text: 'OUI',
                    value: true,
                    visible: true,
                    className: 'confirm',
                    closeModal: true
                },
            }
        }).then(
            (result) => {
                if (result) {
                    if (this.typeCampagne.toLowerCase() === 'encaissement') {
                        this.terminerCampagne();
                    } else {
                        this.account = this.userService.getUserInfo();
                        console.log('******** In terminer()')
                        console.log('******** montanTotal || montant : ' + this.montantTotal);
                        console.log('******** frais : ' + this.frais);
                        console.log('-------- TypeOf montantTotal');
                        console.log(typeof this.montantTotal);
                        const montant: number = parseFloat(this.montantTotal.trim().replace(/\s+/g, '')) + this.frais;
                        console.log('******** montanTotal calculer: ' + montant);

                        const solde: number = this.account.souscription.solde ? +this.account.souscription.solde : 0;
                        console.log(montant);
                        console.log(solde);
                        // || montant <= solde
                        if (solde && montant <= solde) {
                            this.terminerCampagne();
                        } else {
                            swal({
                                icon: 'warning',
                                text: 'Votre solde est insuffisant.'
                            });
                        }
                    }
                }
            }
        );
    }

    async terminerCampagne() {
        console.log('********** In terminerCampagne ********')
        const campagne = new CampagnePartenaire();
        console.log('****** montant : ' + this.montant)
        console.log('****** montant_total : ' + this.montant_total)
        console.log('****** nb_ligne : ' + this.nbClients)
        console.log('****** montantTotal : ' + this.montantTotal)
        console.log('****** fraisTotal : ' + this.fraisTotal)
        console.log('****** frais : ' + this.frais)
        campagne.nomCampagne = this.nomCampagne;
        campagne.details = [];
        campagne.notification = true;
        campagne.typeCanal = this.typeCanalLibelle;
        campagne.canal = this.canalLibelle;
        campagne.montantTotal = +this.montantTotal;
        campagne.fraisTotal = +this.frais;
        campagne.nbClients = this.nbClients;
        campagne.details = this.detailsCampagne;
        campagne.canal_id = this.canal_id;
        console.log('Details campagne ');
        console.log(campagne.details);

        console.log('+++++++++++++++++ Campagne partenaire ++++++++++++++++++');
        console.log(campagne);
        console.log('camapagne saved : ');
        console.log(campagne);

        this.saving = true;
        this.campagneService.compteur.subscribe(
            value => {
                this.p_savedDetail = +value;
            }
        );

        let a  = await this.campagneService.add(campagne, this.typeCampagne).toPromise();

            // .subscribe(
            //     (cmp: Campagne) => {
            //        return  this.saving = true;
            //         /*
            //         // this.closeDialog({canceled: false});
            //         setTimeout(() => {
            //             this.router.navigate(['/partenaire/dashboard'])
            //         }, 500);
            //          */
            //     },
            //     error => {
            //     this.saving = false;
            //     }
            // );

            // this.saving=false;

            console.log("ba ___",a);
            if(a){
                this.router.navigate(['/partenaire/dashboard'], {
                    state: {
                        'campagne': campagne
                    }
                     });
            }
            // if(this.saving)
          
    }

    /**
     * Correction des erreurs sur le fichier
     *
     * @param errors
     * @param index
     */
    handleErrors(errors, index) {
        const nbErrors = errors.length;
        while (index < nbErrors) {
            const error = errors[index];
            if (error) {
                const i = error.ligne - 2;
                const detail = this.detailsCampagne[i];
                this.fileErrors.push(
                    {
                        'detailsCampagne': FileService.formulaireDataToDetails(detail),
                        'typeCampagne': this.typeCampagne,
                        'erreur': error,
                        'ligne': error.ligne,
                    }
                );
                // this.openDetailDialog(detail, this.typeCampagne, error, error.ligne, nbErrors - index);
            }
            index++;
        }

        console.log('Details sur les erreurs rencontrés');
        console.log(this.fileErrors);
        console.log(this.selectedFile);
        console.log(this.errors.length);

        const dialogRef = this.dialog.open(AddDetailCampagneComponent, {
            width: '600px',
            disableClose: true,
            data: {
                erreurs: this.fileErrors,
                typeCampagne: this.typeCampagne,
                file: this.selectedFile,
                nbErrors: this.errors.length
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result || !result.canceled) {
                // passed
            } else {
                console.log(result);
            }
            this.fileLoaded = false;
        });
    }

    openDetailDialog(detail: FormulaireData, typeCampagne, error: DetailCampagneError, ligne, nbErrors): void {
        const dialogRef = this.dialog.open(AddDetailCampagneComponent, {
            data: {detail: detail, typeCampagne: typeCampagne, error: error, ligne: ligne, nbErrors: nbErrors}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result || !result.canceled) {
                this.index++;
                this.handleErrors(this.errors, this.index);
            } else {
                this.closeDialog({canceled: false});
            }
        });
    }

    closeDialog(val) {
        this.dialogRef.close(val);
    }

    deleteAttachment(event) {
        this.selectedFile = null;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    downloadFile() {
        if (this.typeCampagne === 'DECAISSEMENT') {
            this.getFileFromServer('decaissement');
        } else {
            this.getFileFromServer('encaissement');
        }
    }

    getFileFromServer(tag) {
        this.fileService.downloadFile(tag)
            .subscribe(
                resp => {
                    console.log('resp file');
                    console.log(resp);

                    const blob = new Blob([resp.body], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    const url = window.URL.createObjectURL(blob);

                    const element = document.createElement('a');
                    element.href = url;
                    element.download = tag;
                    document.body.appendChild(element);
                    element.click();
                }
            );
    }

    getInfoIndicatif(country:string,service:string){
        this.campagneService.getIndicatifByCountryAndservice(country.toUpperCase(),service.toUpperCase()).subscribe(
           (rep)=>{
               console.log("JSON.stringify(paramCheckNumber", JSON.stringify(rep))
                this.regex_numero = new RegExp(rep['regexp_validation']);
                this.regex_indicatif = rep['regexp_prefix'];
                AddCampagneComponent.indicatif = rep['indicatif'];
                this.message_erreur = rep['message_erreur_rejet'];
                AddCampagneComponent.min_size_auth = rep['minSizeAuth'];
                AddCampagneComponent.max_size_auth = rep['maxSizeAuth'];
                this.isActive  = rep['active'];
                this.actionPrefixPositif  = rep['actionPrefixPositif']

                localStorage.setItem("regex_numero",rep['regexp_validation']);
                localStorage.setItem("indicatif",rep['indicatif']);
                localStorage.setItem("regex_indicatif",rep['regexp_prefix']);

                localStorage.setItem("message_erreur_rejet",rep['message_erreur_rejet']);
                localStorage.setItem("min_size_auth",rep['minSizeAuth']);
                localStorage.setItem("max_size_auth",rep['maxSizeAuth']);
                localStorage.setItem("active",rep['active']);
                localStorage.setItem("actionPrefixPositif",rep['actionPrefixPositif']);

            console.log("min_size_auth ", AddCampagneComponent.min_size_auth);
            console.log("max_size_auth ", AddCampagneComponent.max_size_auth);
            

           },
           (error)=>{
               console.log(error);
           }
       );
   }
    static max_size_auth(arg0: string, max_size_auth: any) {
        throw new Error('Method not implemented.');
    }

    onSelectCanal() {
        if (this.canalLibelle) {
            const tab = this.canals.filter(x => x.libelle === this.canalLibelle);
            console.log("******************* tab **********", JSON.stringify(tab))

            if (tab && tab.length !== 0) {
                console.log(tab[0]);
                this.montantMin = tab[0].montantMin;
                this.montantMax = tab[0].montantMax;
                this.canal_id = tab[0].id;

                console.log("******************* begin test country and service **********")

                if(this.typeCampagne.toLowerCase() === 'decaissement'){

                    this.country = tab[0].pays.toUpperCase();
                    this.service = tab[0].libelle.toUpperCase();
    
                    this.getInfoIndicatif(this.country.toLowerCase(),this.service.toLowerCase());

                    console.log("this.country_______ ", this.country)
                    console.log("this.service _______ ", this.service)

                }


                console.log("******************* end test country and service **********")


                

                console.log('___ Type canal id', this.canal_id);
                console.log('montant min: ', this.montantMin, ' montant max : ', this.montantMax);
            }
        }

       
    }


}
