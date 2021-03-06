import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import {max, maxBy} from 'lodash';
import * as check from 'check-types';

import * as CanvasJS from '../../../assets/js/canvasjs.min';
import {getNationalAirQualityObjective} from '../../shared/utils/air-quality-utils';
import {ObservationModalService} from 'src/app/shared/observation-model/observation-modal.service';


@Component({
  selector: 'buo-air-quality-line-chart',
  templateUrl: './air-quality-line-chart.component.html',
})
export class AirQualityLineChartComponent implements AfterViewInit {

  // @Input() timeseries: Timeseries[];
  @Input() timeseries: Subject<any>;
  @ViewChild('lineChartContainer') container: ElementRef;

  public data: any;
  private recommendedLimit: number;

  constructor(
    private modal: ObservationModalService,
    ) {}

  ngAfterViewInit(): void {

    this.timeseries.subscribe(d => {
      this.data = d;

      this.recommendedLimit = getNationalAirQualityObjective({
        observedProperty: d.observedPropertyId,
        unit: d.unitId
      });

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
      type: 'line',
      xValueType: "dateTime",
      markerType: 'circle',
      markerSize: 5,
      markerColor: colours.point,
      lineColor: colours.line, 
      dataPoints: plotted,
    };
  }

  private drawChart(data) {

    const chartConfig: any = {

      zoomEnabled: true,
      zoomType: "xy",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: this.data.label,
        fontColor: '#024451'
      },
      toolTip: {
        backgroundColor: '#000000',
        cornerRadius: 5,
        borderColor: '#000000',
        fontColor: '#ffffff',
        fontSize: 12,
        contentFormatter: (e) => {
          const dp = e.entries[0].dataPoint;
          return `<i class="far fa-calendar mr-1"></i>${moment(dp.x).format('DD/MM/YYYY')}<br><i class="far fa-clock mr-1"></i>${moment(dp.x).format('HH:mm')}<br>${dp.y} ${this.data.symbol}`
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
    }


    if (check.number(this.recommendedLimit)) {

      chartConfig.axisY.stripLines = [{
        value: this.recommendedLimit,
        label: 'recommended limit',
        lineDashType: 'dash', // dot, dash, solid
        color: 'orange', // of the line
        labelFontColor: 'orange'
      }];

      // What's the maximum datapoint value
      const seriesMaximums = data.map((series) => {
        const maxDataPointInSeries: any = maxBy(series.dataPoints, 'y');
        if (maxDataPointInSeries) {
          return maxDataPointInSeries.y;
        }
      }).filter(check.number);
      const maxDataPointValue = max(seriesMaximums);

      // Make sure the y axis on the graph can accomodates this recommended limit
      let maximumYAxisValue: any = this.recommendedLimit;
      if (check.number(maxDataPointValue) && maxDataPointValue > this.recommendedLimit) {
        maximumYAxisValue = maxDataPointValue;
      }
      chartConfig.axisY.maximum = maximumYAxisValue + (maximumYAxisValue * 0.1); // add a 10% buffer
    }

    let chart = new CanvasJS.Chart(this.container.nativeElement, chartConfig);
      
    chart.render();
  }
}
