import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material';
import {UserService} from '../../_service/auth/user.service';
import {AuthService} from '../../_service/auth/auth.service';
import {Constant} from '../../_constant/constant';
import {EntiteService} from '../../_service/autre/entite.service';
import {FilialeService} from '../../_service/autre/filiale.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaysService} from '../../_service/autre/pays.service';
import {LogService} from '../../_service/autre/log.service';
import {CommunService} from '../../_service/autre/commun.service';

@Component({
  selector: 'app-partenaire',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;
  logs: any[];
  roles = [];
  entites = [];
  filiales = [];
  pays = [];
  searchForm: FormGroup;

  constructor(public dialog: MatDialog,
              private userService: UserService,
              private entiteService: EntiteService,
              private filialeService: FilialeService,
              private paysService: PaysService,
              private logService: LogService,
              private fb: FormBuilder,
              private authService: AuthService) {
    this.searchForm = fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      login: [''],
      profil: [''],
      entite: [''],
      filiale: ['']
    })
  }

  ngOnInit() {
      this.getProfil();
      if (this.userService.isSuperAdmin()) {
        this.getEntite();
        this.getPays();
      }
      if (this.userService.isAdmin()) {
        this.getFiliale();
        this.getPays();
      }

  }

  formatDate(date: string) {
    if (!date) {
      return '';
    }

    const annee  = date.slice(0, 4);
    const mois   = date.slice(4, 6);
    const jour   = date.slice(6, 8);
    const heure  = date.slice(8, 10);
    const minute = date.slice(10, 12);

    return jour + '/' + mois + '/' + annee + ' ' + heure + ':' + minute;
  }

  reset() {
    this.searchForm.reset();
  }

  getProfil() {
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
                  this.roles.push(role);
                } else {
                  // tslint:disable-next-line:max-line-length
                  if (this.userService.isAdmin() && roleName.toLowerCase() !== 'admin_filiale' && roleName.toLowerCase() !== 'adminfiliale') {
                    // ne rien faire
                    this.roles.push(role);
                  } else {
                    this.roles.push(role);
                  }
                }
              }
            }
          }
      );
  }

  getFilialeByEntite(entite: any) {
      if (entite && entite.id) {
          this.filialeService.getFilialesByEntite(entite.id).toPromise()
              .then((data: any[]) => {
                  console.log('Les filiales recus', data);
                  this.filiales = data;
              })
      }
  }

  getFiliale() {
    this.filialeService.getFiliales().toPromise()
        .then((data: any[]) => {
          console.log('Les filiales recus', data);
          this.filiales = data;
        })
  }

  getEntite() {
      this.entiteService.getEntites().toPromise()
          .then((data: any[]) => {
                console.log('Liste des entités: ', data);
                this.entites = data;
              }
          )
  }

  getLibelleById(idt): any {
    for (const e of this.pays) {
      if (e.id === idt) {
        return e.name;
      }
    }
    return null;
  }

  getPays() {
      this.paysService.getAllPays().toPromise()
          .then((data: any[]) => {
            console.log('Liste des pays enregistrés : ');
            console.log(data);
            this.pays = data;
          });
  }

  onSearch() {
    console.log('+++++++++++++++++++ Les donnees du formulaire de recherche ++++++++++++++++++');
    console.log(this.searchForm.value);
    this.logs = [];
    this.logService.findAll(this.currentPage, this.itemsPerPage, this.searchFormToFilter()).toPromise()
        .then(
            (data) => {
                console.log('++++++++++++++++++ Resultat liste logs : ++++++++++++++++');
                console.log(data);
                this.logs = data.data;
            }
        )
  }

  isRoleAdmin() {
      return this.userService.isSuperAdmin() || this.userService.isAdmin();
  }

  isRoleSuperAdmin() {
      return this.userService.isSuperAdmin();
  }

  toDateStamp(timeStamp) {
      const dateStamp = new Date(timeStamp * 1000);
      return dateStamp.toLocaleDateString() + ' ' + dateStamp.toLocaleTimeString();
  }

  searchFormToFilter() {
      console.log();
      const filtres: any[] = [];

      filtres.push({
          libelle: 'dateDebut',
          tag: 'dateAction',
          type: 'greaterThan',
          value: CommunService.myDateFormat(this.searchForm.value.dateDebut, 'debut'),
          valueLabel: CommunService.myDateFormat(this.searchForm.value.dateDebut, 'debut')
      });

      filtres.push({
          libelle: 'dateAction',
          tag: 'dateAction',
          type: 'lessThan',
          value: CommunService.myDateFormat(this.searchForm.value.dateFin, 'fin'),
          valueLabel: CommunService.myDateFormat(this.searchForm.value.dateFin, 'fin')
      });

      if (this.searchForm.value.login) {
          filtres.push({
              libelle: 'login',
              tag: 'login',
              type: 'in',
              value: this.searchForm.value.login + '',
              valueLabel: this.searchForm.value.login
          });
      }

      if (this.searchForm.value.profil) {
          filtres.push({
              libelle: 'profil',
              tag: 'profil',
              type: 'in',
              value: this.searchForm.value.profil + '',
              valueLabel: this.searchForm.value.profil
          });
      }

      if (this.searchForm.value.entite) {
          filtres.push({
              libelle: 'entite',
              tag: 'entite',
              type: 'in',
              value: this.searchForm.value.entite.nom + '',
              valueLabel: this.searchForm.value.entite.nom
          });
      }

      if (this.searchForm.value.filiale) {
          filtres.push({
              libelle: 'filiale',
              tag: 'filiale',
              type: 'in',
              value: this.searchForm.value.filiale + '',
              valueLabel: this.searchForm.value.filiale
          });
      }
      return filtres;
  }
}
