import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LoaderService} from '../../../_service/auth/loader.service';
import {Subject} from 'rxjs';

import * as XLSX from 'xlsx';
import {CommunService} from '../../../_service/autre/commun.service';

declare var swal;

@Component({
    selector: 'app-show-list',
    templateUrl: './show-list.component.html',
    styleUrls: ['./show-list.component.scss']
})
export class ShowListComponent implements OnInit {
    @Input()
    source: any
    loading = true;
    @Input()
    partners: any[];
    @Input()
    isDialog = false;
    @Input()
    title: 'FATY';
    @Input()
    iconTitle: string;
    @Input()
    entities: any[];
    @Input()
    headers: string[];
    @Input()
    itemsPerPage: number;
    @Input()
    currentPage: number;
    @Input()
    totalItems: number;
    @Input()
    add = true;
    @Input()
    edit = true;
    @Input()
    custom = true;
    @Input()
    filtre = false;
    @Input()
    fieldsForSearch: any[];
    @Input()
    fieldSForFiltre: any[];
    @Input()
    delete = true;
    @Input()
    customButtons: any[];

    @Output()
    onDetailClicked: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onEditClicked: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onDeleteClicked: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onPaginationClicked: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onCustomButtonClicked: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onCloseDialogClicked: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onExportDataClicked: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    filterChange: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    itemsPerPageChange: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    public b: boolean;

    maxSize = 10;

    constructor(
        private loaderService: LoaderService,
        private communService: CommunService) {
    }

    ngOnInit() {

        this.loaderService.isLoading
            .subscribe(
                (value => {
                    this.loading = value;
                }));
    }


    onNewDetails(entity) {
        this.onDetailClicked.emit(entity)
    }

    onDetails(entity, modify: boolean) {    
        this.b = modify;
        this.onDetailClicked.emit(entity);
    }

    onEdit(entity) {
        this.onEditClicked.emit(entity);
    }

    onDelete(entity) {
        this.onDeleteClicked.emit(entity);
    }

    onCustomButton(tag, entity) {
        this.onCustomButtonClicked.emit({tag, entity});
    }

    getEntities(event) {
        this.onPaginationClicked.emit(event);
    }

    closeDialog() {
        this.onCloseDialogClicked.emit(null);
    }

    onExport(event) {
        this.onExportDataClicked.emit(event);
    }

    onFilterChange(event) {
        this.filterChange.emit(event);
    }

    onSelectChange(event) {
        this.itemsPerPageChange.emit(event);
    }

    exporter() {
        this.communService.exporter(this.entities, this.title);
    }

    refreshCampagneAndDetails(event) {
        this.onPaginationClicked.emit(event);
    }

}
