import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Subject } from 'rxjs';
import * as moment from 'moment';
import * as CanvasJS from '../../../assets/js/canvasjs.min';
import { ObservationModalService } from '../ObservationModal/observation-modal.service';

@Component({
    selector: 'buo-column-chart',
    template: `
        <div class="border border-gray-200 rounded-md bg-white shadow-inner p-4">
            <div class="mt-4 w-full h-80" #barChartContainer></div>
            <ng-template #noDataMessage>
                <div class="w-full text-sm leading-5 text-center text-gray-800">
                    No data for the selected time period.
                </div>
            </ng-template>
        </div>`,
})
export class ColumnChartComponent implements AfterViewInit {

    // @Input() timeseries: Timeseries[];
    @Input() timeseries: Subject<any>;
    @ViewChild('barChartContainer') container: ElementRef;

    public data: any;

    constructor(
        private modal: ObservationModalService,
        ) {}

    ngAfterViewInit(): void {

        this.timeseries.subscribe(d => {
            this.data = d;

            const graphData = d.tso.map((ts) => this.plotData(ts));
            this.drawChart(graphData);
        })
    }

    private plotData(ts) {
        const colours = ts.colours;
        const plotted = ts.observations.map((point) => ({ 
            x: moment(point.resultTime).valueOf() , 
            y: point.hasResult.value,
            id: point.id,
            click: (e) => { 
                this.modal.observationSelected(e.dataPoint.id);
            } 
        }));

        return {
            type: 'column',
            color: colours.point,
            xValueType: "dateTime",
            dataPoints: plotted,
        };
    }

    private drawChart(data) {
         let chart = new CanvasJS.Chart(this.container.nativeElement, {
            zoomEnabled: true,
            zoomType: "xy",
            animationEnabled: true,
            exportEnabled: true,
            title: {
                text: this.data.label
            },
            toolTip: {
                backgroundColor: '#000000',
                cornerRadius: 5,
                borderColor: '#000000',
                fontColor: '#ffffff',
                fontSize: 12,
                contentFormatter: (e) => {
                    const dp = e.entries[0].dataPoint;
                    return `<i class="far fa-calendar mr-1"></i>${moment(dp.x).format('DD/MM/YYYY')}<br><i class="far fa-clock mr-1"></i>${moment(dp.x).format('HH:mm')}<br>${dp.y}${this.data.symbol}`
                },
            },
            axisX: {
                title: 'Date and Time',
                titleFontColor: '#718096',
                titleFontWeight: 'bold',
                titleFontSize: 12,
                labelFormatter: (label) => {
                    const dt = moment(label.value);
                    return dt.format('HHmm') === '0000' ? dt.format('DD/MM/YYYY HH:mm') : dt.format('HH:mm');
                },
                labelFontColor: '#718096',
                lineColor: '#CBD5E0',
            },
            axisY: {
                title: `${this.data.label} (${this.data.symbol})`,
                titleFontColor: '#718096',
                titleFontWeight: 'bold',
                titleFontSize: 12,
                gridColor: '#EDF2F7',
                lineColor: '#CBD5E0',
                includeZero: false,
                labelFontColor: '#718096',
            },
            data: data
        });
            
        chart.render();
    }
}
