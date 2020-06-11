import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Chart } from 'chart.js';
import * as moment from 'moment';

import { Timeseries } from 'src/app/Services/timeseries/timeseries.class';
import { Subject } from 'rxjs';
import 'chartjs-plugin-zoom';

@Component({
    selector: 'buo-line-graph',
    template: `
        <div class="border border-gray-200 rounded-md bg-white shadow-inner p-4">
            <div class="overflow-x-scroll">
                <div class="mt-4" #lineChartContainer>
                    <canvas #lineChart height="400" width="0"></canvas>
                </div>
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
    @ViewChild('lineChartContainer') container: ElementRef;

    public data: any;
    // public width: number = 800; [ngStyle]="{'width.px': width }"
    private chart: Chart;

    ngAfterViewInit(): void {

        // console.log(this.container.nativeElement.clientWidth )

        this.timeseries.subscribe(d => {
            this.data = d;

            if (this.chart) {
                console.log('destroy old chart')
                this.chart.destroy();
            }

            const graphData = d.tso.map((ts) => this.plotData(ts));
            this.drawChart(graphData);
        })
    }

    private plotData(ts) {
        const plotted = ts.observations.map((points) => ({ x: points.resultTime, y: points.hasResult.value, unit: '' }));
         
        const w = plotted.length * 15;

        // this.width = w > this.width ? w : this.width;

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

    private dragOptions = {
        animationDuration: 1000
    };

    private drawChart(data) {

        this.chart = new Chart(this.canvas.nativeElement, {
            type: 'line',
            data: {
                datasets: data,
            },
            options: {
                plugins: {
					zoom: {
						zoom: {
							enabled: true,
							// drag: this.dragOptions,
							mode: 'xy',
							speed: 0.05
						}
					}
				},
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
                        ticks: {
                            // Include date in the label if time 00:00
                            callback: function(value, index, values) {
                                if (value === '00:00') {
                                    const u = values[index].value / 1000;
                                    return moment.unix(u).format('DD/MM/YYYY HH:mm')
                                }
                                return value;
                            }
                        },
                        type: 'time',
                        time: {
                            unit: 'hour',
                            unitStepSize: 1,
                            minUnit: 'hour',
                            displayFormats: {
                                hour: 'HH:mm',
                                day: 'MMM D',
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
