import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboardpos',
  templateUrl: './dashboardpos.component.html',
  styleUrls: ['./dashboardpos.component.scss']
})
export class DashboardposComponent implements OnInit {
  single:any = [];
  single2:any = [];
  view:[number,number]  = [700, 400];
  // options
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  legendPosition = 'Right';
  xAxisLabel = 'Country';
  yAxisLabel = 'Population';
  colorScheme = {
    domain: ['#5cad55', '#7AA9DA', '#e1cc35']
  };

  couleur2 = '#7AA9DA';

  constructor() {
    // @ts-ignore
    this.single = [
      {
        'name': 'Ventes journalier',
        'value': 8940000
      },
      {
        'name': 'Versement',
        'value': '500000'
      },
      {
        'name': 'Dépense',
        'value': 7200000
      },

    ];
    this.single2 = [
      {
        'name': 'Lundi',
        'value': 100000
      },
      {
        'name': 'Mardi',
        'value': 300000
      },
      {
        'name': 'Mercredi',
        'value': 250000
      },
      {
        'name': 'Jeudi',
        'value': 700000
      },
      {
        'name': 'Vendredi',
        'value': 500000
      },
      {
        'name': 'Samedi',
        'value': 900000
      },
      {
        'name': 'Diamanche',
        'value': 800000
      }
    ];
    // @ts-ignore
    // Object.assign(this, { this.single });
  }


  ngOnInit(): void {
  }
  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
