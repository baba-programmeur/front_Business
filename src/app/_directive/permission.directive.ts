import {Directive, Input, ElementRef, OnInit} from '@angular/core';
import {UserService} from '../_service/auth/user.service';

@Directive({
  selector: '[hasPermission]',
})
export class PermissionDirective implements OnInit {
  @Input() hasPermission: string;

  constructor(private eRef: ElementRef,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.checkHabilitation(this.hasPermission);
  }

  checkHabilitation(permission) {
    const element = this.eRef.nativeElement;
    if (!this.userService.hasPermission(permission)) {
      element.classList.add('hide');
    } else {
      element.classList.add('show');
    }
  }
}
