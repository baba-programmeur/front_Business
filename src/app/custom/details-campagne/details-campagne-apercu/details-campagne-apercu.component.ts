import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {DetailCampagne} from '../../../_model/detail-campagne';
import {FormulaireData} from '../../../_model/formulaire-data';

declare var $;

@Component({
    selector: 'app-details-campagne-apercu',
    templateUrl: './details-campagne-apercu.component.html',
    styleUrls: ['./details-campagne-apercu.component.scss']
})
export class DetailsCampagneApercuComponent implements OnInit, AfterViewInit {
    headers: string[];
    @ViewChild('dataTable') table;
    dataTable: any;
    entities: any[];

    @Input()
    entete: any[];
    @Input()
    details: FormulaireData[];
    @Input()
    typeCampagne: string;

    constructor() {
    }

    ngOnInit() {
        this.detailsToEntities(this.details, this.typeCampagne);
    }

    ngAfterViewInit(): void {
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json'
            }
        });
    }

    /**
     * @param details
     * @param typeCampange
     */
    detailsToEntities(details, typeCampange = null) {
        this.entities = [];

        if (details) {
            for (const item of details) {
                // console.log('_______ item for apercu');
                // console.log(item);

                const values = [];
                for (const val of item.items) {
                    values.push(val.valeur);
                }

                // console.log('_______ values for apercu');
                // console.log(values);
                if (typeCampange) {
                    this.entities.push({
                        object: item,
                        values: values
                    });
                }
            }
        }
    }
}
