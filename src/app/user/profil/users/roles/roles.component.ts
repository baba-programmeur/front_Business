import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditEntityComponent} from '../../../../custom/global/edit-entity/edit-entity.component';
import {HabilitationsOfRoleComponent} from '../habilitations-of-role/habilitations-of-role.component';
import {UserService} from '../../../../_service/auth/user.service';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  habilitations: any[];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  constructor(private userService: UserService,
              private dialog: MatDialog) { }

  ngOnInit() {
      this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 10,
          processing: true,
          language: {
              url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json'
          }
      };
    this.getRoles();
    this.getHabilitations();
  }

  getRoles() {
    this.roles = [];

    this.userService.getRoles().subscribe(
        (roles: any[]) => {
            console.log(roles);
            let roleName = '';
            for (const role of roles) {
                roleName = role.name;
                if ((this.userService.isAdmin() || this.userService.isSuperAdmin()) && roleName && roleName.split(':').length > 1) {
                    console.log('je ne recupere pas');
                } else {
                    this.roles.push(role);
                }
            }
            this.dtTrigger.next();
        }
    );
  }

  getHabilitations() {
      if (!this.userService.isSuperAdmin()) {
          this.userService.getHabilitationsForUser()
              .subscribe(
                  (habilitations: any[]) => {
                      this.habilitations = habilitations;
                  }
              );
      } else {
          this.userService.getHabilitations()
              .subscribe(
                  (habilitations: any[]) => {
                      this.habilitations = habilitations;
                  }
              );
      }
      // this.habilitations = this.userService.getUserHabilitation();
  }

  onAddRole() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = {
      title: 'Nouveau rôle',
      entity: {},
      fields: [
        {label: 'Nom', tag: 'name', type: 'text', valeur: '', required: true},
        {label: 'Description', tag: 'description', type: 'text', valeur: '', required: false},
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
      if (result && result.submit) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
          });
          this.getRoles();
      }
    });
  }

  onListHabilitations(role) {
    console.log('----------------');
    console.log(role.name);
    console.log('----------------');
    this.userService.getRoleHabilitations(role.name)
        .subscribe(
            habilitations => {
              console.log('__ role habilitations ');
              console.log(habilitations);

              this.dialog.open(HabilitationsOfRoleComponent, {
                width: '600px',
                data: {
                  role,
                  habilitations,
                  allHabilitations: this.habilitations
                }
              });
            }
        );
  }

    editRole(role) {
        console.log(role);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '400px';
        dialogConfig.data = {
            title: 'Modification de rôle',
            entity: {},
            fields: [
                {label: 'Description', tag: 'description', type: 'text', valeur: role.description, required: false},
            ],
            validate: (entity: any) => {
                entity.id = role.id;
                entity.name = role.name;
                return this.userService.editRole(entity).toPromise()
                    .then(
                        resp => {
                            return resp;
                        }
                    );
            }
        };

        this.dialog.open(EditEntityComponent, dialogConfig)
            .afterClosed().subscribe((result) => {
            if (result && result.submit) {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    // Destroy the table first
                    dtInstance.destroy();
                    // Call the dtTrigger to rerender again
                });
                this.getRoles();
            }
        });

    }
}
