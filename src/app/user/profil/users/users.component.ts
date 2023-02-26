import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../../../_model/user';
import {CommunService} from '../../../_service/autre/commun.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditEntityComponent} from '../../../custom/global/edit-entity/edit-entity.component';
import {UserService} from '../../../_service/auth/user.service';
import {Compte} from '../../../_model/compte';
import {Souscription} from '../../../_model/souscription';
import {AuthService} from '../../../_service/auth/auth.service';
import {RolesOfUserComponent} from './roles-of-user/roles-of-user.component';
import {FormulaireService} from '../../../_service/autre/formulaire.service';
import {SouscriptionService} from '../../../_service/autre/souscription.service';
import {SouscriptionDialogComponent} from '../../../custom/partenaire/souscription-dialog/souscription-dialog.component';
import {ShowDetailComponent} from '../../../custom/global/show-detail/show-detail.component';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {EntiteService} from '../../../_service/autre/entite.service';
import {Constant} from '../../../_constant/constant';
import {PaysService} from '../../../_service/autre/pays.service';
import {FilialeService} from '../../../_service/autre/filiale.service';
// import swal from 'sweetalert';

declare var swal;
declare var $;

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    account: any;
    user: User;
    souscription: Souscription;
    itemsPerPage = Constant.ITEMS_PER_PAGE;
    currentPage = Constant.CURRENT_PAGE;
    isAdmin = false;
    isPartenaire = false;
    isAdminFiliale = false;
    isAdminFinancier = false;
    addUser = true;
    p = 1;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    users: any[] = [];
    roles: any[] = [];
    rolesPartenaire: any[] = [];
    habilitations: any[];

    totalItems: number;
    selectedUser: User;
    entities: any[] = [];
    filiales: any[] = [];
    pays: any[] = [];

    constructor(private userService: UserService,
                private communService: CommunService,
                private authService: AuthService,
                private formulaireService: FormulaireService,
                private souscriptionService: SouscriptionService,
                private entiteService: EntiteService,
                private paysService: PaysService,
                private filialeService: FilialeService,
                private dialog: MatDialog) {
    }

    async ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            processing: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json'
            }
        };
        this.getAccount();
        this.getUsers();
        this.getRoles();
        this.getEntites();
        this.getPays();
        this.getFiliales();
    }

    getUsers() {
        this.userService.getUsersByOwner().subscribe(
            (users: any[]) => {
                console.log('-------------- Utilisateurs: ------------ ', users);
                this.users = users;
                this.dtTrigger.next();
            }
        );
    }

    getRoles() {
        this.roles = [];
        this.userService.getRoles().subscribe(
            (roles: any[]) => {
                console.log(roles);
                let roleName = '';
                for (const role of roles) {
                    roleName = role.name;
                    // tslint:disable-next-line:max-line-length
                    if ((this.userService.isAdmin() || this.userService.isSuperAdmin() || this.userService.isAdminFiliale()) && roleName.split(':').length > 1) {
                        console.log('je ne recupere pas');
                    } else {
                        if (this.userService.isSuperAdmin() && roleName.toLowerCase() !== 'admin') {
                            // ne rien faire
                            this.rolesPartenaire.push(role);
                        } else {
                            // tslint:disable-next-line:max-line-length
                            if (this.userService.isAdmin() && roleName.toLowerCase() !== 'admin_filiale' && roleName.toLowerCase() !== 'adminfiliale') {
                                // ne rien faire
                                this.rolesPartenaire.push(role);
                            } else {
                                this.roles.push(role);
                            }
                        }

                    }
                }
            }
        );
    }

    getEntites() {
        if (this.userService.isSuperAdmin()) {
            this.entiteService.findAll(this.currentPage, this.itemsPerPage, null).toPromise()
                .then((data) => {
                    console.log('Liste des entités enregistrés : ');
                    console.log(data.data);
                    const tabDatas = data.data;
                    if (tabDatas) {
                        for (const el of tabDatas) {
                            if (el.statut.toUpperCase() === 'VALIDE') {
                                this.entities.push({
                                    label: el.nom,
                                    value: el.id
                                })
                            }
                        }
                    }
                });
        }
    }

    getFiliales() {
        if (this.userService.isAdmin()) {
            this.filialeService.findAll(this.currentPage, this.itemsPerPage, null).toPromise()
                .then((data) => {
                    console.log('Liste des filiales enregistrés : ');
                    console.log(data.data);
                    const tabDatas = data.data;
                    if (tabDatas) {
                        for (const el of tabDatas) {
                            if (el.etat === true) {
                                this.filiales.push({
                                    label: this.getLibelleById(el.paysId, this.pays).label,
                                    value: el.id
                                })
                            }
                        }
                    }
                });
        }
    }

    getPays() {
        if (this.userService.isAdmin()) {
            this.paysService.findAll(this.currentPage, this.itemsPerPage, null).toPromise()
                .then((data) => {
                    console.log('Liste des entités enregistrés : ');
                    console.log(data.data);
                    const tabDatas = data.data;
                    if (tabDatas) {
                        for (const el of tabDatas) {
                                this.pays.push({
                                    label: el.name,
                                    value: el.id
                                })
                        }
                    }
                });
        }
    }

    onAddUser() {
        this.userService.getRoles().subscribe(
            (datas: any[]) => {
                const roles = [];
                if (datas) {
                    for (const role of datas) {
                        console.log(role);
                        const roleName: string = role.name;
                        if ((this.userService.isAdmin() || this.userService.isSuperAdmin() || this.userService.isAdminFiliale()) && roleName.split(':').length > 1) {
                            console.log('je ne recupere pas');
                        } else {
                            if (this.userService.isSuperAdmin() && roleName.toLowerCase() !== 'admin') {
                                // ne rien faire
                            } else {
                                // tslint:disable-next-line:max-line-length
                                if (this.userService.isAdmin() && roleName.toLowerCase() !== 'admin_filiale' && roleName.toLowerCase() !== 'adminfiliale') {
                                    // ne rien faire
                                } else {
                                    roles.push(
                                        {
                                            label: role.name,
                                            value: role.name
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
                const fields = [
                    {label: 'Prénom', tag: 'firstName', type: 'text', valeur: '', required: true},
                    {label: 'Nom', tag: 'lastName', type: 'text', valeur: '', required: true},
                    {label: 'Email', tag: 'email', type: 'text', valeur: '', required: true},
                    {label: 'Login', tag: 'login', type: 'text', valeur: '', required: true},
                    {label: 'Role', tag: 'role', type: 'select', valeur: '', required: true, options: roles}
                ];
                if (this.userService.isAdminFiliale()) {
                    fields.push(
                        {label: 'Souscription', tag: 'souscription', type: 'toggle', valeur: '', required: false}
                    )
                }
                if (this.userService.isAdmin()) {
                    fields.push(
                        {label: 'Filiale', tag: 'filiale', type: 'select', valeur: '', required: true, options: this.filiales}
                    )
                }
                if (this.userService.isSuperAdmin()) {
                    fields.push(
                        {label: 'Entite', tag: 'entite', type: 'select', valeur: '', required: true, options: this.entities}
                    )
                }
                const dialogConfig = new MatDialogConfig();
                dialogConfig.width = '400px';
                dialogConfig.disableClose = true;
                dialogConfig.data = {
                    title: 'Nouvel utilisateur',
                    entity: {},
                    fields: fields,
                    validate: (entity: any) => {
                        console.log(entity);
                        const tabRoles = [];
                        tabRoles.push(entity.role);
                        entity.authorities = tabRoles;
                        console.log(entity.souscription);
                        return this.userService.add(entity).toPromise()
                            .then(
                                resp => {
                                    console.log(resp);
                                    if (entity.souscription === true) {
                                        this.addSouscription(resp);
                                    }
                                    return resp;
                                },
                                (error) => {
                                    console.log('---------- ERROR -----');
                                    console.log(error);
                                }
                            );
                    }
                };

                this.dialog.open(EditEntityComponent, dialogConfig)
                    .afterClosed().subscribe((result) => {
                    if (result && result.submit) {
                        swal({
                            'icon': 'success',
                            'text': 'Utilisateur ajouté avec succés'
                        });
                        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                            // Destroy the table first
                            dtInstance.destroy();
                            // Call the dtTrigger to rerender again
                        });
                        this.getUsers();
                    }
                });
            }
        );
    }

    onListRoles(user) {
        this.userService.getUserRoles(user.id)
            .subscribe(
                (roles: any[]) => {
                    this.dialog.open(RolesOfUserComponent, {
                        width: '500px',
                        data: {
                            user,
                            roles,
                            allRoles: this.roles,
                            rolesPartenaire: this.rolesPartenaire
                        }
                    })
                }
            );
    }

    getLibelleById(idt, tab: any[]): any {
        console.log('Le tableau recu');
        console.log(tab);

        console.log('Id recu : ', idt);
        for (const e of tab) {
            if (e.value == idt) {
                return e;
            }
        }
        return null;
    }

    getAccount() {
        this.authService.account
            .subscribe(
                (account: Compte) => {
                    this.account = account;

                    this.user = this.account.user;

                    // check if user is admin
                    if (this.userService.isAdmin()) {
                        this.isAdmin = true;
                    } else if (UserService.isAdminFinancier()) {
                        this.isAdminFinancier = true;
                        this.addUser = false;
                    } else if (this.userService.isPartenaire()) {
                        this.isPartenaire = true;
                        this.souscription = this.account.souscription;
                    }

                }
            );

        if (this.account == null) {
            this.account = this.userService.getUsersByOwner();

            if (this.account) {
                this.user = this.account.user;
                // check if user is admin
                if (this.userService.isAdmin()) {
                    this.isAdmin = true;
                } else if (UserService.isAdminFinancier()) {
                    this.isAdminFinancier = true;
                    this.addUser = false;
                } else if (this.userService.isPartenaire()) {
                    this.isPartenaire = true;
                    this.souscription = this.account.souscription;
                }
            }
        }
    }

    changeState(state, user) {
        const title = state ? 'Activation' : 'Désactivation';
        const action = state ? 'activer' : 'désactiver';
        swal({
            title,
            text: 'Vous allez ' + action + ' l\'utilisateur "' + user.username + '"',
            closeOnClickOutside: false,
            buttons: {
                cancel: {
                    text: 'Annuler',
                    value: false,
                    visible: true,
                    className: 'cancel',
                    closeModal: true,
                },
                confirm: {
                    text: 'Confirmer',
                    value: true,
                    visible: true,
                    className: 'confirm',
                    closeModal: true
                },
            }
        }).then(
            result => {
                console.log('___ Swal result : ', result);
                if (result) {
                    // activer / desactiver utilisateur
                    this.userService.changeState(user, state)
                        .subscribe(
                            resp => {
                                console.log('___ User state has been changed !');
                                this.refreshUsers(resp);
                            }
                        )
                }
            }
        );
    }

    refreshUsers(user) {
        if (this.users) {
            // tslint:disable-next-line:triple-equals
            const index = this.users.findIndex(item => item.id == user.id);
            // tslint:disable-next-line:triple-equals
            if (index != -1) {
                this.users[index] = user;
            }
        }
    }

    // Ajout de souscription pour un user donné
    addSouscription(user: any) {
        // find formulaire
        this.dialog.open(SouscriptionDialogComponent, {
            width: '900px',
            disableClose: false,
            data: {
                userId : user.id,
                title: 'Nouvelle souscription pour ' + user.firstName + ' ' + user.lastName
            }
        }).afterClosed().subscribe(val => {
            if (val) {
                if (val.submit) {
                    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                        // Destroy the table first
                        dtInstance.destroy();
                        // Call the dtTrigger to rerender again
                    });
                    this.getUsers()
                }
            }
        });
    }

    editUser(user) {
        console.log(user);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '400px';
        dialogConfig.disableClose = true;
        dialogConfig.data = {
            title: 'Modification de l\'utilisateur ' + user.username,
            entity: {},
            fields: [
                {label: 'Prénom', tag: 'firstName', type: 'text', valeur: user.firstName, required: true},
                {label: 'Nom', tag: 'lastName', type: 'text', valeur: user.lastName, required: true},
                {label: 'Email', tag: 'email', type: 'text', valeur: user.email, required: true}
            ],
            validate: (entity: any) => {
                entity.username = user.username;
                entity.id = user.id;
                return this.userService.edit(entity).toPromise()
                    .then(
                        (org) => {
                            return org;
                        },
                        (error) => {
                            return error;
                        }
                    );
            }
        };

        this.dialog.open(EditEntityComponent, dialogConfig)
            .afterClosed().subscribe(val => {
            if (val) {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    // Destroy the table first
                    dtInstance.destroy();
                    // Call the dtTrigger to rerender again
                });
                this.getUsers();
            }
        });
    }

    onDetails(user: any) {
        let addSous = false;
       this.userService.getUserDetails(user.id)
           .subscribe(
               (details: any) => {
                   console.log(details);
                   const tabDetails = [];
                   if (details.user) {
                       const headerUser = Object.keys(details.user);
                       for (const keyUser of headerUser) {

                           if (keyUser !== 'roles') {
                               tabDetails.push({libelle: keyUser.toUpperCase(), valeur: details.user[keyUser]})
                           }
                       }
                   }
                   if (details.souscription) {
                       const headerSous = Object.keys(details.souscription);
                       for (const keySous of headerSous) {
                           // tslint:disable-next-line:max-line-length
                           if (keySous.toLowerCase() !== 'consomme' && keySous.toLowerCase() !== 'entite' && keySous.toLowerCase() !== 'filiale' && keySous.toLowerCase() !== 'statut' && keySous.toLowerCase() !== 'type' && keySous.toLowerCase() !== 'pays' && keySous.toLowerCase() !== 'id' && keySous.toLowerCase() !== 'email' && keySous.toLowerCase() !== 'solde') {
                               tabDetails.push({libelle: keySous.toUpperCase(), valeur: details.souscription[keySous]})
                           }
                       }
                   } else {
                       console.log('Verifier si utilisateur possede souscription');
                       console.log(details.user.roles);
                       if (details.user && details.user.roles) {
                           for (const role of details.user.roles) {
                               const roleName: string = role.name;
                               if (roleName.includes('partenaire')) {
                                   addSous = true;
                               }
                           }
                       }
                   }
                   console.log('Ajout de souscription : ', addSous);
                   this.dialog.open(ShowDetailComponent, {
                       width: '500px',
                       data: {
                           title: 'Détails utilisateur',
                           addSouscription : addSous,
                           details: tabDetails
                       }
                   }).afterClosed().subscribe(val => {
                       if (val) {
                           console.log(val);
                           this.addSouscription(user);
                       }
                   });
               }
           )
    }

    toDateStamp(timeStamp) {
        const dateStamp = new Date(timeStamp);
        return dateStamp.toLocaleDateString() + ' ' + dateStamp.toLocaleTimeString();
    }
}
