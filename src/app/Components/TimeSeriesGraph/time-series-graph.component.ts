import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { Chart } from 'chart.js';
import { ObservationService } from 'src/app/observation/observation.service';

import * as moment from 'moment';

@Component({
    selector: 'buo-time-series-graph',
    template: `
        <div class="p-4">
            <canvas #chart height="100"></canvas>
        </div>`,
})
export class TimeSeriesGraphComponent implements OnInit {

    @Input() sensor;
    @ViewChild('chart', { static: true }) canvas;

    constructor(
        private observationService: ObservationService
    ) { }

    ngOnInit(): void {

        this.observationService.getObservations({
            madeBySensor: {
                in: [this.sensor.id]
            },
            resultTime: {
                gte: moment().subtract('24', 'hours').toISOString(),
                lte: moment().toISOString(),
            }
        })
            .subscribe((response) => {
                const data = response.data.reduce((d, arr) => {
                    d.labels.push(moment(arr.resultTime).format('HH:mm, DD/MM/YY'));
                    d.values.push(arr.hasResult.value);
                    return d;
                }, { labels: [], values: [] });

                this.drawChart(data);
            });
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
