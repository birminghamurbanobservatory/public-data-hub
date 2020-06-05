import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Chart } from 'chart.js';
import * as moment from 'moment';

import { Timeseries } from 'src/app/Services/timeseries/timeseries.class';

@Component({
    selector: 'buo-line-graph',
    template: `
        <div class="border border-gray-200 rounded-md bg-white shadow-inner p-4">
            <div class="mt-4 -mx-2" *ngIf="timeseries.length; else noDataMessage">
                <canvas #chart height="100"></canvas>
            </div>
            <ng-template #noDataMessage>
                <div class="w-full text-sm leading-5 text-center text-gray-800">
                    No data for the selected time period.
                </div>
            </ng-template>
        </div>`,
})
export class LineGraphComponent implements OnInit {

    @Input() timeseries: Timeseries[];
    @ViewChild('chart', { static: true }) canvas: ElementRef;

    constructor() {}

    ngOnInit(): void {
        if (this.timeseries.length) {
            const graphData = this.timeseries.map((ts) => this.plotData(ts));
            this.drawChart(graphData);
        }
    }

    private plotData(ts) {
        const plotted = ts.obs.map((points) => ({ x: points.resultTime, y: points.hasResult.value, unit: '' }));
        const colours = ts.colours;

        return {
            fill: false,
            data: plotted,
            borderColor: colours.line,
            pointBackgroundColor: colours.point,
            pointBorderColor: colours.point,
            pointHoverBackgroundColor: colours.hover,
            pointHoverBorderColor: colours.hover,
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
                                `Value: ${tooltipItem.value} ${this.timeseries[idx].unit.symbol}`
                            ];
                        } 
                    }
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: this.timeseries[0].observedProperty.label
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

    /**
     * Tooltip title format method
     * @param item 
     */
    private tooltipTitle(item) {
        return this.timeseries[item[0].datasetIndex].observedProperty.label.toUpperCase();
    }

}
