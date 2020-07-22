import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Timeseries} from 'src/app/shared/models/timeseries.model';
import {switchMap, catchError, takeUntil} from 'rxjs/operators';
import {TimeseriesService} from 'src/app/shared/services/timeseries.service';
import {Observable, throwError, Subject} from 'rxjs';
import streamSaver from 'streamsaver';
import {Observation} from 'src/app/shared/models/observation.model';
import {Parser} from 'json2csv';
import * as check from 'check-types';
import {pick, last, concat, omit, round} from 'lodash';
import {FormBuilder} from '@angular/forms';
import {sub} from 'date-fns';

@Component({
  selector: 'buo-timeseries-export',
  templateUrl: './timeseries-export.component.html',
  styleUrls: ['./timeseries-export.component.css']
})
export class TimeseriesExportComponent implements OnInit, OnDestroy {

  public exportForm;
  public timeseriesId: string;
  public timeseries: Timeseries;
  public getTimeseriesErrorMessage = '';
  public getObservationsErrorMessage = '';
  private writer: any;
  public exportAborted = false;
  public exporting = false;
  public obsTally = 0;
  public percentThroughExportPeriod = 0;
  public loopNumber = 0;
  public showMoreInfo = false;

  constructor(
    private route: ActivatedRoute,
    private timeseriesService: TimeseriesService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.exportForm = this.fb.group({
      window: '', // this will be updated once we get the timeseries
      includeLocation: true,
      includeFlaggedObs: false
    })

    this.route.paramMap.pipe(
      switchMap((params) => {
        this.timeseriesId = params.get('timeseriesId');
        this.getTimeseriesErrorMessage = '';
        return this.timeseriesService.getTimeseriesById(this.timeseriesId, {populate: [
          'aggregation',
          'observedProperty',
          'unit',
          'madeBySensor',
          'ancestorPlatforms',
          'disciplines',
          'hasDeployment',
          'hasFeatureOfInterest',
          'usedProcedures'
        ]});
      }),
      catchError((err) => {
        console.error(err.message);
        this.getTimeseriesErrorMessage = err.message;
        return throwError(err);
      })
    ).subscribe((timeseries) => {
      this.exportForm.controls['window'].setValue([
        new Date(timeseries.startDate),
        new Date(timeseries.endDate)
      ])
      this.timeseries = timeseries;
    })


    // If someone leaves the page make sure any running filestream's are tidied up.
    window.onunload = () => {
      this.cleanUpFileStream()
    }

  }


  public toggleMoreInfo() {
    this.showMoreInfo = !this.showMoreInfo;
  }


  public export(options) {

    this.getObservationsErrorMessage = '';
    this.exportAborted = false;
    this.exporting = true;
    this.obsTally = 0;
    this.percentThroughExportPeriod = 0;
    this.loopNumber = 0;

    const filename = `obs-${this.timeseriesId}-${this.dateToFilenameComponent(options.window[0])}-to-${this.dateToFilenameComponent(options.window[1])}.csv`;
    const fileStream = streamSaver.createWriteStream(filename);
    this.writer = fileStream.getWriter();

    const where: any = {
      resultTime: {
        gte: options.window[0].toISOString(),
        lte: options.window[1].toISOString()
      }
    };

    if (!options.includeFlaggedObs) {
      where.flags = {exists: false};
    }

    const getOptions = {
      sortBy: 'resultTime',
      sortOrder: 'asc',
      limit: 1000
    };

    const hasInstantAggregation = this.timeseries.aggregation && this.timeseries.aggregation.id === 'instant';

    const writeOptions = {
      includeLocation: options.includeLocation,
      includePhenomenonInfo: !hasInstantAggregation,
      includeFlagsColumn: options.includeFlaggedObs
    };

    this.recursivelyGetAndWriteObservations(this.timeseriesId, where, getOptions, writeOptions);

  }


  public abortExport() {

    this.exportAborted = true;
    this.exporting = false;

    this.cleanUpFileStream();

  }


  private recursivelyGetAndWriteObservations(timeseriesId: string, where: any = {}, getOptions: any = {}, writeOptions: any = {}) {

    this.loopNumber += 1;

    if (this.exportAborted === false) {

      this.timeseriesService.getTimeseriesObservations(timeseriesId, where, getOptions)
      .pipe(
        catchError((err) => {
          console.error(err.message);
          this.getObservationsErrorMessage = err.message;
          this.abortExport();
          return throwError(err);
        })
      )
      .subscribe(({data: observations, meta}) => {

        if (this.exportAborted === false) {

          this.obsTally += observations.length;

          let encoded;
          if (observations.length > 0) {

            const lastObs: Observation = last(observations);
            const lastObsTime = new Date(lastObs.resultTime);
            this.percentThroughExportPeriod = this.calcPercentThroughPeriod(new Date(where.resultTime.gte), new Date(where.resultTime.lte), lastObsTime);
    
            const csvStringOptions = Object.assign({}, writeOptions, {
              includeHeader: this.loopNumber === 1,
            })
            const csvString = this.observationsToCsvString(observations, csvStringOptions );
            encoded = new TextEncoder().encode(csvString);

          }

          const moreObsAvailable = check.assigned(meta.next);

          if (moreObsAvailable) {

            this.writer.write(encoded)
            .then(() => {

              // Now to get the next "page" of observations
              const optionKeys = ['limit', 'offset', 'sortBy', 'sortOrder'];
              const nextOptions = pick(meta.next, optionKeys);
              this.recursivelyGetAndWriteObservations(timeseriesId, where, nextOptions, writeOptions);

            });

          } else {

            if (encoded) {
              this.writer.write(encoded)
              .then(() => {
                this.writer.close();
                this.exporting = false;
              });

            } else {
              this.writer.close();
              this.exporting = false;
            }

          }

        }

      });
    
    } else {
      this.cleanUpFileStream();
    }

  }



  private observationsToCsvString(observations: Observation[], {includeHeader, includePhenomenonInfo, includeLocation, includeFlagsColumn}): string {

    const fields = [
      {
        label: 'result time',
        value: 'resultTime'
      },
      {
        label: 'value',
        value: 'hasResult.value'
      }
    ];

    if (includePhenomenonInfo) {
      fields.push({
        label: 'has beginning',
        value: 'phenomenonTime.hasBeginning'
      });
      fields.push({
        label: 'has end',
        value: 'phenomenonTime.hasEnd'
      });
      fields.push({
        label: 'duration',
        value: 'phenomenonTime.duration'
      });
    }

    if (includeLocation) {
      fields.push({
        label: 'longitude',
        value: 'location.geometry.coordinates[0]'
      });
      fields.push({
        label: 'latitude',
        value: 'location.geometry.coordinates[0]'
      })
      fields.push({
        label: 'height (m)',
        value: 'location.properties.height'
      })
    }

    if (includeFlagsColumn) {
      fields.push({
        label: 'flags',
        value: 'hasResult.flags'
      });
    }

    const csvParser = new Parser({fields, header: includeHeader});
    const csvString = csvParser.parse(observations); 
    return csvString + '\n';

  }


  private calcPercentThroughPeriod(start: Date, end: Date, present: Date): number {
    return round(((present.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100);
  }


  private dateToFilenameComponent(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
  

  private cleanUpFileStream() {
    // It's good practise to abort the filestream before leaving.
    // Docs: https://github.com/jimmywarting/StreamSaver.js
    if (this.writer) {
      this.writer.abort();
    }
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.cleanUpFileStream();
  }


}
