import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../_service/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
    } else {
      this.auth.logout();
    }
    // this.router.navigate(['/login']);
  }

}
