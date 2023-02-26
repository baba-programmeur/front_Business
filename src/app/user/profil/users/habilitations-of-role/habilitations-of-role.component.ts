import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../../../_service/auth/user.service';

declare var swal;

@Component({
  selector: 'app-habilitations-of-role',
  templateUrl: './habilitations-of-role.component.html',
  styleUrls: ['./habilitations-of-role.component.scss']
})
export class HabilitationsOfRoleComponent implements OnInit {
  role: any;
  habilitations: any;
  allHabilitations;
  habilitationsToShow: any[] = [];
  toAdd: any[] = [];
  toRemove: any[] = [];

  constructor(public dialogRef: MatDialogRef<HabilitationsOfRoleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userService: UserService) {
    if (data) {
      if (data.habilitations) {
        this.habilitations = data.habilitations;
      }
      if (data.allHabilitations) {
        this.allHabilitations = data.allHabilitations;
      }
      if (data.role) {
        this.role = data.role;
      }
    }
  }

  ngOnInit() {
    this.getHabilitationsToShow();
  }

  /**
   * habilitations à afficher selon le statut
   */
  getHabilitationsToShow() {
    for(let item of this.allHabilitations) {
      let habilitations = item.habilitations;
      if (habilitations) {
        let nb = habilitations.length;
        let nbChecked = 0;

        let habsToShow = [];
        for (let habilitation of habilitations) {
          if (this.habilitationExist(habilitation, item.libelle, this.habilitations)) {
            habsToShow.push({id: habilitation.id, name: habilitation.name, description: habilitation.description, exist: true});
            nbChecked++;
          } else {
            habsToShow.push({id: habilitation.id, name: habilitation.name, description: habilitation.description, exist: false});
          }
        }

        let hasAllHabs = false;
        if (nb == nbChecked) {
          hasAllHabs = true;
        }

        this.habilitationsToShow.push({libelle: item.libelle, all: hasAllHabs, habilitations: habsToShow});
      }
    }
  }

  /**
   * Vérifier si une habilitation existe dans la liste de toutes les habilitations
   *
   * @param habilitation
   * @param libelle
   * @param habilitations
   */
  habilitationExist(habilitation, libelle, habilitations) {
    if (habilitations != null) {
      for (let item of habilitations) {
        if (item.libelle == libelle) {
          for (let hab of item.habilitations) {
            if (hab.name == habilitation.name) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  /**
   * Gestion des choix
   *
   * @param event
   * @param habilitation
   * @param parent
   */
  onCheck(event, habilitation, parent) {
    for (let item of this.habilitationsToShow) {
      if (parent) {
        if (item.libelle == habilitation.libelle) {
          item.all = event.checked;
          for (let hab of item.habilitations) {
            hab.exist = event.checked;
          }
        }
      } else {
        for (let hab of item.habilitations) {
          if (habilitation.id == hab.id) {
            hab.exist = event.checked;

            item.all = this.isAllChecked(item.habilitations);
            break;
          }
        }
      }
    }
  }

  /**
   * Valider les modifications
   */
  onValidate() {
    this.toAdd = [];
    this.toRemove = [];

    for (let item of this.habilitationsToShow) {
      for (let habilitation of item.habilitations) {
        if (habilitation.exist) {
          this.toAdd.push(habilitation);
        } else {
          this.toRemove.push(habilitation);
        }
      }
    }

    this.userService.updateRoleHabilitations(this.role.name, this.toAdd, this.toRemove)
        .subscribe(
            resp => {
              console.log(resp);
              swal({
                icon: 'success',
                text: 'Habilitations modifiées !!!'
              });
              this.dialogRef.close()
            }
        );

    console.log('___ to add');
    console.log(this.toAdd);
    console.log('___ to remove');
    console.log(this.toRemove);
  }

  /**
   * Vérifier si toutes les habilitations d'un groupe sont cochées ou pas
   *
   * @param habilitations
   */
  isAllChecked(habilitations) {
    if (habilitations != null) {
      for (let item of habilitations) {
        if (!item.exist) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  onSwitchBloc(event: MouseEvent) {
    const target = event.srcElement;

    console.log("_id = ", target);
    console.log("_id = ", event);

    const $li = $(target).parent();

    if ($li.children(".item").hasClass('open')) {
      $li.children(".item").removeClass('open');
      $li.children(".item").addClass('close');
      $li.children(".item").css('display', 'none');
      $li.children(".item").css('animation', '2s');

      $(target).removeClass('fa-chevron-up');
      $(target).addClass('fa-chevron-down');

    } else if ($li.children(".item").hasClass('close')) {
      $li.children(".item").removeClass('close')
      $li.children(".item").addClass('open')
      $li.children(".item").css('display', 'block');
      $li.children(".item").css('animation', '2s');

      $(target).removeClass('fa-chevron-down');
      $(target).addClass('fa-chevron-up');
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
