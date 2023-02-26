import {UserService} from '../../_service/auth/user.service';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare var swal;

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {
  key: string;
  message: any;
  success: any;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        console.log('Params: ');
        console.log(params);

        if (!params || !params.key) {
          this.router.navigate(['/login']);
        } else {
          this.key = params.key;

            this.userService.activate(this.key)
            .subscribe(
              resp => {
                console.log('Account activated !!!');
                console.log(resp);

                this.success = resp;

                swal({
                    icon: 'success',
                    text: 'Votre compte est activé avec succés!'
                }).then(() => {
                    this.router.navigate(['/login']);
                });
              });
        }
      }
    );
  }

}
