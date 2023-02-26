import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-monbutton',
  templateUrl: './monbutton.component.html',
  styleUrls: ['./monbutton.component.scss']
})
export class MonbuttonComponent implements OnInit {
@Input() texte = "[texte]";
@Input() width = "100%";
@Input() icone_left   = "";
@Input() icone_right  = "";
@Input() couleur_secondaire = false;
@Input() maxwidth  = "100%";
@Input() height  = "35px";
@Input() radius = "5px";
@Input() icone_size = "35px";
@Input() background_button = "rgba(150, 196, 255, 0.41)";
@Input() color_texte = "#1877F2";
@Input() texte_size = "14px";
@Input() bold_texte = false;

  constructor() { }

  ngOnInit(): void {
  }

}
