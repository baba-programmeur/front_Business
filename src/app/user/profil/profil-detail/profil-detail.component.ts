import {Component, OnInit} from '@angular/core';
import {Constant} from '../../../_constant/constant';
import {Router} from '@angular/router';
import {AuthService} from '../../../_service/auth/auth.service';
import {UserService} from '../../../_service/auth/user.service';
import {MatDialog} from '@angular/material';
import {ServerService} from '../../../_service/auth/server.service';
import {ProfilEditComponent} from '../profil-edit/profil-edit.component';
import {ImageUploaderComponent} from '../../../custom/image-uploader/image-uploader.component';
import {Souscription} from '../../../_model/souscription';
import {User} from '../../../_model/user';

declare var swal: any;

@Component({
  selector: 'app-profil-detail',
  templateUrl: './profil-detail.component.html',
  styleUrls: ['./profil-detail.component.scss']
})
export class ProfilDetailComponent implements OnInit {
  account: any;
  user: User;
  souscription: any;
  imageUrl;

  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService,
              public dialog: MatDialog,
              private serverService: ServerService) { }


  ngOnInit() {
    this.getAccount();
  }

  getAccount() {
      this.account = JSON.parse(sessionStorage.getItem(Constant.ACCOUNT));
      if (this.account) {
          this.user = this.account.user;
          this.souscription = this.account.souscription;
          this.imageUrl = this.user.imageUrl;
      }

      console.log('_______ Image URL', this.imageUrl);

      this.authService.account
      .subscribe(
        (account: any) => {
          console.log(account);

          if (account) {
            this.account = account;
            this.user = this.account.user;
            this.souscription = this.account.souscription;
            this.imageUrl = this.user.imageUrl;
          }
        },
        error => {
          console.log('Error get Account in profile', error);
        }
      );
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(ImageUploaderComponent, {
      width: '900px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result.canceled) {
        swal(
          {
            title: 'Confirmation',
            text: 'Vous allez modifier l\'image de profil ?',
            buttons: {
              cancel: {
                text: 'Annuler',
                value: 'no',
                visible: true
              },
              confirm: {
                text: 'Confirmer',
                  value: 'yes',
              }
            }
          }).then(
          resp => {
            console.log('Result', resp);
            if (resp === 'yes') {
                console.log(result);

              this.serverService.uploadUserImage(result.file)
                .subscribe(
                  (response: any) => {
                    console.log('___ file saved : ');
                    console.log(response);
                    if (response) {
                      this.imageUrl = response.imageUrl;

                      // update user
                      const account = JSON.parse(sessionStorage.getItem(Constant.ACCOUNT));

                      account.user.imageUrl = this.imageUrl;
                      this.authService.account = account;
                    }
                  });
            }
          }
        );

      }
    });
  }

  onUpdate() {
    const dialogRef = this.dialog.open(ProfilEditComponent, {
      width: '800px',
      data: {
        user: this.account.user
      }
    });

    dialogRef.afterClosed()
      .subscribe((result) =>  {
        if (result && !result.canceled) {
          this.authService.getAccount();
        }
      });
  }
}
