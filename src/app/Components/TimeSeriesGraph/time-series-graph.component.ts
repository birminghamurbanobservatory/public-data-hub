import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { Chart } from 'chart.js';
import { ObservationService } from 'src/app/observation/observation.service';

import * as moment from 'moment';
import { TimeSeriesService } from 'src/app/Services/timeseries/timeseries.service';
import { Timeseries } from 'src/app/Services/timeseries/timeseries.class';
import { forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
    selector: 'buo-time-series-graph',
    template: `
        <div class="mt-4 border border-gray-200 rounded-md bg-white shadow-inner p-4">
            <div class="flex justify-end">
                <span class="relative z-0 inline-flex">
                    <button (click)="redraw(6)"  type="button" class="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
                    last 6 hours
                    </button>
                    <button (click)="redraw(12)" type="button" class="-ml-px relative inline-flex items-center px-2 py-1 border border-gray-300 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
                    last 12 hours
                    </button>
                    <button (click)="redraw(24)"  type="button" class="-ml-px relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
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

    @Input() timeseries: Timeseries[];

    @ViewChild('chart', { static: true }) canvas;

    public period: number = 6;


    constructor(
        private timeseriesService: TimeSeriesService,
    ) { }

    ngOnInit(): void {

        this.getTimeseries();

    }

    private getTimeseries() {

        const apiCalls = this.timeseries.map((ts) => {
            return this.timeseriesService.getTimeseriesObservations(ts.id, {
            resultTime: {
                    gte: moment().subtract(this.period, 'hours').toISOString(),
                    lte: moment().toISOString(),
                }
            })
        });

        forkJoin(apiCalls)
            .pipe(
                map((data) => data.map(set => this.plotData(set))),
            )
            .subscribe((datasets) => this.drawChart(datasets));
    }

    public redraw(period: number) {

        if (period === this.period) {
            return;
        }

        this.period = period;
        this.getTimeseries();
    }

    private plotData(data) {
        const plotted = data.reduce((points, arr) => {
            points.push({ x: arr.resultTime, y: arr.hasResult.value })
            return points;
            }, []);
    

        return {
            fill: false,
            data: plotted,
            // borderColor: "red",
            // borderDash: [5, 5],
            // backgroundColor: "#e755ba",
            // pointBackgroundColor: "#55bae7",
            // pointBorderColor: "#55bae7",
            // pointHoverBackgroundColor: 'red',
            // pointHoverBorderColor: 'red',
        };
    }

    private drawChart(data) {

        new Chart(this.canvas.nativeElement, {
            type: 'line',
            data: {
                datasets: data,
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    displayColors: false, // removes the square color box
                    callbacks: { 
                        title: () => {
                            return 'Air Temperature';
                        },
                        label: (tooltipItem, data) => {
                            return [
                                `Time: ${moment(tooltipItem.xLabel).format('HH:mm')}`, 
                                `Date: ${moment(tooltipItem.xLabel).format('DD/MM/YY')}`, 
                                `Value: ${tooltipItem.value}`
                            ];
                        } 
                    }
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Air Temperature'
                        }
                    }],
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'HHmm'
                            }
                        },
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
