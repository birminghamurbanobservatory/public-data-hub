import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { Chart } from 'chart.js';
import { ObservationService } from 'src/app/observation/observation.service';

import * as moment from 'moment';
import { TimeSeriesService } from 'src/app/Services/timeseries/timeseries.service';

@Component({
    selector: 'buo-time-series-graph',
    template: `
        <div class="p-4">
            <canvas #chart height="100"></canvas>
        </div>`,
})
export class TimeSeriesGraphComponent implements OnInit {

    @Input() timeseries: string;
    @ViewChild('chart', { static: true }) canvas;

    constructor(
        private timeseriesService: TimeSeriesService,
    ) { }

    ngOnInit(): void {

        this.timeseriesService.getTimeseriesObservations(this.timeseries)
        .subscribe((data) => this.plotData(data));

        // this.observationService.getObservations({
        //     madeBySensor: {
        //         in: [this.sensor.id]
        //     },
        //     resultTime: {
        //         gte: moment().subtract('24', 'hours').toISOString(),
        //         lte: moment().toISOString(),
        //     }
        // })
        //     .subscribe((response) => {
        //         const data = response.data.reduce((d, arr) => {
        //             d.labels.push(moment(arr.resultTime).format('HH:mm, DD/MM/YY'));
        //             d.values.push(arr.hasResult.value);
        //             return d;
        //         }, { labels: [], values: [] });

        //         this.drawChart(data);
        //     });
    }

    private plotData(data) {
        const plotted = data.reduce((d, arr) => {
            d.labels.push(moment(arr.resultTime).format('HH:mm, DD/MM/YY'));
            d.values.push(arr.hasResult.value);
            return d;
            }, { labels: [], values: [] });
    
        this.drawChart(plotted);
    }

    private drawChart(data) {

        const chart = new Chart(this.canvas.nativeElement, {
            type: 'line',
            data: {
                labels: data.labels.reverse(),
                datasets: [{
                    data: data.values.reverse(),
                }]
            },
            options: {
                legend: {
                    display: false
                }
            }
        });

    }

}
