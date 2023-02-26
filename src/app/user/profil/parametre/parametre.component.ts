import { Component, OnInit } from '@angular/core';
import {ConfirmDeleteComponent} from '../../../custom/global/confirm-delete/confirm-delete.component';
import {MatDialog} from '@angular/material/dialog';
import {UpdateMailListComponent} from './update-mail-list/update-mail-list.component';
import {ParametrageService} from '../../../_service/autre/parametrage.service';
import {Constant} from '../../../_constant/constant';
import {UserService} from '../../../_service/auth/user.service';
import {Compte} from '../../../_model/compte';
import {Parametrage} from '../../../_model/parametrage';
import {LigneParametrage} from '../../../_model/ligne-parametrage';
import {ConfirmComponent} from '../../../custom/global/confirm/confirm.component';

declare var swal;

@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.scss']
})
export class ParametreComponent implements OnInit {

  parametrageTab: Parametrage[];
  ligneParametrageTab: LigneParametrage[];

  itemsPerPage = Constant.ITEMS_PER_PAGE;
  currentPage = Constant.CURRENT_PAGE;

  account: Compte;

  constructor(private dialog: MatDialog, private parametrageService: ParametrageService, private userService: UserService) { }

  ngOnInit() {
   this.account = this.userService.getUserInfo();
   console.log(this.account);
   this.loadLigneParametrages(1);
   this.loadParametrages(1);
  }

  modifierListe(liste: String) {
    if (liste) {
      return liste.replace(';', ' | ');
    }
  }

  editValue(id: any, etat: boolean, value: any) {
    this.dialog.open(UpdateMailListComponent, {
      width: '400px',
      data: {
        valeur: value
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
        const ligne = new LigneParametrage(false);
        ligne.etat = etat;
        ligne.valeur = result.valeur;
        ligne.parametrageId = id;
        ligne.souscriptionId = this.account.souscription.id + '';

        this.parametrageService.addLigneParametrage(ligne).toPromise()
            .then((data) => {
              console.log('________________ Les données recues apres creation : ', data);
              swal({
                icon: 'success',
                text: 'Notification mis à jour avec succès!'
              }).then(() => {
                this.loadLigneParametrages(1);
              });
            });
      }
    });
  }

  loadParametrages(page, filters = null) {
    this.currentPage = page;

    this.parametrageService.findAll(this.currentPage, this.itemsPerPage, filters).toPromise()
        .then((result) => {
          if (result) {
            this.parametrageTab = result.data;
            console.log('___________ Tableau de parametrage', this.parametrageTab);
          }
        });
  }

  loadLigneParametrages(page) {
    this.currentPage = page;
    const filters = {
      'souscriptionId.equals': this.account.souscription.id
    };

    this.parametrageService.findLigneSouscriptionByPartner(this.currentPage, this.itemsPerPage, filters).toPromise()
        .then((result) => {
          if (result) {
            console.log('___________ Tableau de ligne de parametrages: ', result.data);
            this.ligneParametrageTab = result.data;
          }
        });
  }

  getLigneParametrage(parametrage: Parametrage): LigneParametrage {
    if (this.ligneParametrageTab && this.ligneParametrageTab.length > 0) {
      return this.ligneParametrageTab.find(e => {
        return +e.parametrageId === parametrage.id && +e.souscriptionId === this.account.souscription.id
      });
    } else {
      return new LigneParametrage(false);
    }
  }

  updateLigneParametrage(parametrage: any, valeur: string, etat: boolean) {
    const messageEtat = etat ? 'désactivée' : 'activée';
    const messageSucces = parametrage.libelle + ' ' + messageEtat + ' avec succès';
    this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        message : etat ? 'Voulez vous désactiver le paramétrage' : 'Voulez vous activer le paramétrage',
        fields: [
          { label: 'Libelle', valeur: parametrage.libelle}
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result.canceled) {
                const ligne = new LigneParametrage(false);
                ligne.etat = !etat;
                ligne.valeur = valeur;
                ligne.parametrageId = parametrage.id;
                ligne.souscriptionId = this.account.souscription.id + '';

                this.parametrageService.addLigneParametrage(ligne).toPromise()
                    .then((data) => {
                      console.log('________________ Les données recues apres creation : ', data);
                      swal({
                        icon: 'success',
                        text: messageSucces
              }).then(() => {
                this.loadLigneParametrages(1);
              });
            });
      } else {
          this.loadParametrages(1);
      }
    });
  }
}
