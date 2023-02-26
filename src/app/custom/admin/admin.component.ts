import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @ViewChild('menu') menu: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  onShowMenu(val) {
    if (val) {
      this.menu.nativeElement.className = 'show-menu menu';
    } else {
      this.menu.nativeElement.className = 'hide-menu menu';
    }
  }
}
