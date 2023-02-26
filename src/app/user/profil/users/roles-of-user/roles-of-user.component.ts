import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../../../_service/auth/user.service';

declare var swal;

@Component({
  selector: 'app-roles-of-user',
  templateUrl: './roles-of-user.component.html',
  styleUrls: ['./roles-of-user.component.scss']
})
export class RolesOfUserComponent implements OnInit {
  roles: any[];
  allRoles: any[];
  rolesPartenaire: any[];
  user: any;
  rolesToShow: any[] = [];
  toAdd: any[] = [];
  toRemove: any[] = [];
  isPartenaireUser = false;

  constructor(public dialogRef: MatDialogRef<RolesOfUserComponent>,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      if (data.roles) {
        this.roles = data.roles;
        console.log('Role user');
        console.log(this.roles);
      }
      if (data.allRoles) {
        this.allRoles = data.allRoles;
      }
      if (data.user) {
        this.user = data.user;
      }
      if (data.rolesPartenaire) {
        this.rolesPartenaire = data.rolesPartenaire;
        console.log('Role partenaire');
        console.log(this.rolesPartenaire);
      }
      this.isPartenaireUser = this.isPartenaireRoles(this.roles, this.rolesPartenaire);
    }
  }

  ngOnInit() {
    this.getRolesToShow();
  }

  getRolesToShow() {
    for (let role of this.allRoles) {
      if ((this.userService.isAdmin() || this.userService.isSuperAdmin()) && role.name && role.name.split(':').length > 1) {
        console.log('je ne recupere pas');
      } else {
        if (this.roleExist(role, this.roles)) {
          this.rolesToShow.push({id: role.id, name: role.name, exist: true, toAdd: true});
        } else {
          this.rolesToShow.push({id: role.id, name: role.name, exist: false, toAdd: false});
        }
      }
    }
  }

  onCheck(event, role) {
    console.log('___Event : ');
    console.log(event);
    if (event.checked) { // à ajouter
      if (!role.exist && !this.roleExist(role, this.toAdd)) {
        this.toAdd.push(role);
      }

      this.toRemove = this.removeRole(role, this.toRemove);
    } else { // à supprimer
      this.removeRole(role, this.toAdd);

      if (role.exist && !this.roleExist(role, this.toRemove)) {
        this.toRemove.push(role);
      }
    }
  }

  onValidate() {
    this.userService.addRolestoUser(this.user.id, this.toAdd, this.toRemove)
        .subscribe(
            resp => {
              console.log('___ roles to user');
              console.log(resp);
              swal({
                icon: 'success',
                text: 'Roles modifiés !!!'
              });
              this.onClose();
            }
        );
  }

  onClose() {
    this.dialogRef.close();
  }

  removeRole(role, roles: any[]) {
    if (this.roles) {
      let index = roles.indexOf(role);

      if (index != -1) {
        roles.splice(index, 1);
      }
    }

    return roles;
  }

  roleExist(role, roles: any[]) {
    if (roles && roles.length !== 0) {
      for (const item of roles) {
        if (role.name === item.name) {
          return true;
        }
      }

      return false;
    }
  }

  isPartenaireRoles(roles: any[], rolesPartenaires: any[]) {
    if (roles && rolesPartenaires) {
      for (const role of rolesPartenaires) {
        for (const r of roles) {
          if (role.name.toLowerCase() === r.name.toLowerCase()) {
            return true
          }
        }
      }
    }
    return false;
  }

}
