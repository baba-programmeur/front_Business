import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener, Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-filtre',
  templateUrl: './filtre.component.html',
  styleUrls: ['./filtre.component.scss']
})
export class FiltreComponent implements OnInit {
  @ViewChild('searchItems') searchItems: ElementRef;
  @ViewChild('fields') fields: ElementRef;
  @ViewChild('filtreButton') filtreButton: ElementRef;

  searching = false;
  filtering = false;
  filterField: any;
  filterOptions: any[];

  searchKey: string;
  searchKeyLabel: string;
  searchArray: any[] = [];
  fieldRight = 12;

  @Input()
  fieldsForSearch: any[];
  @Input()
  fieldsForFilter: any[];
  @Input()
  filtre = false;

  @Output()
  filterChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Inject(DOCUMENT) document) { }

  ngOnInit() {
    this.sortFieldArray();

    if (this.filtre) {
      this.fieldRight = 122;
    }
  }


  @HostListener('document:click', ['$event'])
  clickout(event) {

    if (this.fields) {
      if(!this.fields.nativeElement.contains(event.target)) {
        this.searching = false;
      }
    }

    if (this.filtreButton && this.filtreButton.nativeElement && this.filtreButton.nativeElement.contains(event.target)) {
      this.filtering = !this.filtering;
    }
  }

  onSearch(val) {
    this.searching = val;
  }

  onSelectFieldForSearch(field, filter = false, event = null) {
    if (event) {
      this.searchKey = event.value;
      this.searchKeyLabel = event.libelle;
    }
    else {
      this.searchKeyLabel = this.searchKey;
    }

    this.searchArray.push({libelle: field.name, value: this.searchKey, valueLabel: this.searchKeyLabel, tag: field.tag, type: field.type});

    this.searching = false;
    this.filtering = false;
    this.searchKey = '';

    this.onFilterChange(this.searchArray);

    // sort searchArray
    this.sortFieldArray();
  }

  onSelectFieldForFilter(field) {
    this.filtering = true;
    this.filterField = field;
    this.filterOptions = [];

    field.onGetFieldOptions().then(
        (data) => {
          if (data) {
            this.filterOptions = data;
          }
        }
    );

    this.onFilterChange(this.searchArray);
  }

  onClose(item) {
    this.searchKey = '';
    this.searchKeyLabel = '';

    const index = this.searchArray.indexOf(item);
    this.searchArray.splice(index, 1);

    // this.fieldsForSearch.push({name: item.libelle, tag: item.tag});
    this.onFilterChange(this.searchArray);

    // sort searchArray
    this.sortFieldArray();
  }

  sortFieldArray() {
    if (this.fieldsForSearch) {
      this.fieldsForSearch.sort((a, b) => {
        if (a.level && b.level) {
          return (a.level >= b.level) ? 1 : 0;
        }
      });
    }
  }

  onFilterChange(event) {
    this.filterChange.emit(event);
  }

}
