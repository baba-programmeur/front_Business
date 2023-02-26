import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';

@Component({
  selector: 'app-log-show',
  templateUrl: './log-show.component.html',
  styleUrls: ['./log-show.component.scss']
})
export class LogShowComponent implements OnInit, AfterViewInit {
  @Input()
  logs;

  // Datatables options
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  constructor() {
  }

  ngOnInit() {
    console.log('++++++++++++++++//////////////////////');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json'
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  update() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
    });
  }

  toDateStamp(timeStamp) {
    const dateStamp = new Date(timeStamp * 1000);
    return dateStamp.toLocaleDateString() + ' ' + dateStamp.toLocaleTimeString();
  }

}
