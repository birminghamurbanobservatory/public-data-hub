import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Chart } from 'chart.js';
import * as moment from 'moment';

import { Timeseries } from 'src/app/Services/timeseries/timeseries.class';
import { Subject } from 'rxjs';

@Component({
    selector: 'buo-line-graph',
    template: `
        <div class="border border-gray-200 rounded-md bg-white shadow-inner p-4">
            <div class="mt-4 -mx-2">
                <canvas #lineChart height="100"></canvas>
            </div>
            <ng-template #noDataMessage>
                <div class="w-full text-sm leading-5 text-center text-gray-800">
                    No data for the selected time period.
                </div>
            </ng-template>
        </div>`,
})
export class LineGraphComponent implements AfterViewInit {

    // @Input() timeseries: Timeseries[];
    @Input() timeseries: Subject<any>;
    @ViewChild('lineChart') canvas: ElementRef;

    public data: any;

    ngAfterViewInit(): void {
        this.timeseries.subscribe(d => {
            this.data = d;
            const graphData = d.tso.map((ts) => this.plotData(ts));
            this.drawChart(graphData);
        })
    }

    private plotData(ts) {
        const plotted = ts.observations.map((points) => ({ x: points.resultTime, y: points.hasResult.value, unit: '' }));
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
                responsive: true,
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
                                `Value: ${tooltipItem.value} ${this.data.symbol}`
                            ];
                        } 
                    }
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            // labelString: this.timeseries[0].observedProperty.label
                            labelString: this.data.label
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
                            labelString: 'Time'
                        }
                    }]
                },
                elements: {
                    line: {
                        tension: 0 // joins dots with a straight, not curved, line
                    }
                }
            }
        });

    }

    /**
     * Tooltip title format method
     * @param item 
     */
    private tooltipTitle(item) {
        return this.data.label.toUpperCase();
    }

}
