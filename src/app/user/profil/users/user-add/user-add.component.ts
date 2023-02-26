import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditEntityComponent} from '../../../../custom/global/edit-entity/edit-entity.component';
import {UserService} from '../../../../_service/auth/user.service';
import {Router} from '@angular/router';
import {SouscriptionDialogComponent} from '../../../../custom/partenaire/souscription-dialog/souscription-dialog.component';
import {Constant} from '../../../../_constant/constant';
import {EntiteService} from '../../../../_service/autre/entite.service';
import {FilialeService} from '../../../../_service/autre/filiale.service';
import {PaysService} from '../../../../_service/autre/pays.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  entities: any[] = [];
  filiales: any[] = [];
  pays: any[] = [];

  constructor(private dialog: MatDialog,
              private userService: UserService,
              private entiteService: EntiteService,
              private filialeService: FilialeService,
              private paysService: PaysService,
              private router: Router) { }

  ngOnInit() {
    this.getPays();
    this.getFiliales();
    this.getEntites();
    this.onAddUser();
  }


  onAddUser() {
        this.userService.getRoles().subscribe(
            (datas: any[]) => {
                const roles = [];
                if(datas) {
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
                        const tabRoles = [];
                        tabRoles.push(entity.role);
                        entity.authorities = tabRoles;
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
                                    console.log('-------- ERROR ADD');
                                    console.log(error);
                                }
                            );
                    }
                };

                this.dialog.open(EditEntityComponent, dialogConfig)
                    .afterClosed().subscribe((result) => {
                    if (result) {
                        this.router.navigate(['utilisateurs/get-all']);
                    }
                });
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
                    this.router.navigate(['utilisateurs/get-all']);
                }
            }
        });
    }

}
