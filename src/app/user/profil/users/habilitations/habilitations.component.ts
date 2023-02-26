import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../../_service/auth/user.service';

@Component({
  selector: 'app-habilitations',
  templateUrl: './habilitations.component.html',
  styleUrls: ['./habilitations.component.scss']
})
export class HabilitationsComponent implements OnInit {
  habilitations: any[];
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getHabilitations();
  }

  getHabilitations() {
    this.userService.getHabilitationsForUser().subscribe(
        (habilitations: any[]) => {
          this.habilitations = habilitations;
        }
    );
  }

}
