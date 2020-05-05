import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { Chart } from 'chart.js';
import { ObservationService } from 'src/app/observation/observation.service';

import * as moment from 'moment';
import { TimeSeriesService } from 'src/app/Services/timeseries/timeseries.service';

@Component({
    selector: 'buo-time-series-graph',
    template: `
        <div class="mt-4 border border-gray-200 rounded-md bg-white shadow-inner p-4">
            <div class="flex justify-end">
                <span class="relative z-0 inline-flex">
                    <button type="button" class="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
                    last 6 hours
                    </button>
                    <button type="button" class="-ml-px relative inline-flex items-center px-2 py-1 border border-gray-300 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
                    last 12 hours
                    </button>
                    <button type="button" class="-ml-px relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
                    last 24 hours
                    </button>
                </span>
            </div>
            <div class="mt-4 -mx-2">
                <canvas #chart height="100"></canvas>
            </div>
        </div>`,
})
export class TimeSeriesGraphComponent implements OnInit {

    @Input() timeseries: string;

    @ViewChild('chart', { static: true }) canvas;

    public period: number = 6;


    constructor(
        private timeseriesService: TimeSeriesService,
    ) { }

    ngOnInit(): void {

        this.timeseriesService.getTimeseriesObservations(this.timeseries, {
            resultTime: {
                gte: moment().subtract(this.period, 'hours').toISOString(),
                lte: moment().toISOString(),
            }
        })
        .subscribe((data) => this.plotData(data));

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
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Air Temperature'
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Date time'
                        }
                    }]
                }
            }
        });

    }

}
