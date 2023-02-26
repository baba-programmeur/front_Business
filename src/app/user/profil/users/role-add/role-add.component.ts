import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditEntityComponent} from '../../../../custom/global/edit-entity/edit-entity.component';
import {UserService} from '../../../../_service/auth/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.onAddRole();
  }

  onAddRole() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      title: "Nouveau rôle",
      entity: {},
      fields: [
        {label: 'Nom', tag: 'name', type: 'text', valeur: "", required: true},
        {label: 'Description', tag: 'description', type: 'text', valeur: "", required: false},
      ],
      validate: (entity: any) => {

        return this.userService.addRole(entity).toPromise()
            .then(
                resp => {
                  return resp;
                }
            );
      }
    };

    this.dialog.open(EditEntityComponent, dialogConfig)
        .afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(['roles/get-all']);
      }
    });
  }

}
