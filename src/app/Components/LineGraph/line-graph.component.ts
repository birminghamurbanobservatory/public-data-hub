import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { Chart } from 'chart.js';
import { ObservationService } from 'src/app/observation/observation.service';

import * as moment from 'moment';
import { TimeSeriesService } from 'src/app/Services/timeseries/timeseries.service';
import { Timeseries } from 'src/app/Services/timeseries/timeseries.class';
import { forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
    selector: 'buo-line-graph',
    template: `
        <div class="border border-gray-200 rounded-md bg-white shadow-inner p-4">
            <div class="mt-4 -mx-2">
                <canvas #chart height="100"></canvas>
            </div>
        </div>`,
})
export class LineGraphComponent implements OnInit {

    @Input() tso$;

    @ViewChild('chart', { static: true }) canvas;

    constructor(
    ) {}

    ngOnInit(): void {
                // map((data) => data.map((set, i) => this.plotData(set, i))),

        this.tso$.subscribe((o) => {

        })
    }


    private plotData(data, idx) {

        console.log(data);
        const plotted = data.map((points) => ({ x: points.resultTime, y: points.hasResult.value, unit: '' }));

        // const colours = this.tso[idx].colours;

        return {
            fill: false,
            data: plotted,
            // borderColor: colours.line,
            // pointBackgroundColor: colours.point,
            // pointBorderColor: colours.point,
            // pointHoverBackgroundColor: colours.hover,
            // pointHoverBorderColor: colours.hover,
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
                hover: {
                    mode: 'nearest',
                },
                tooltips: {
                    displayColors: false, // removes the square color box
                    callbacks: { 
                        title: (tooltipItem) => {
                            return this.tooltipTitle(tooltipItem)
                        },
                        label: (tooltipItem) => {

                            const idx = tooltipItem.datasetIndex; // the datasetIndex is the same as the timeseries index

                            return [
                                `Time: ${moment(tooltipItem.xLabel).format('HH:mm')}`, 
                                `Date: ${moment(tooltipItem.xLabel).format('DD/MM/YY')}`, 
                                // `Value: ${tooltipItem.value} ${this.timeseries[idx].unit.symbol}`
                            ];
                        } 
                    }
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            // labelString: this.timeseries[0].observedProperty.label
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
                            labelString: 'Date'
                        }
                    }]
                }
            }
        });

    }

    private tooltipTitle(item) {
        // return this.timeseries[item[0].datasetIndex].observedProperty.label.toUpperCase();
    }

}
