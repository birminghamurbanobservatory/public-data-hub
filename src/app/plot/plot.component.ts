import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {omit, cloneDeep, uniq, maxBy} from 'lodash';
import * as check from 'check-types';
import {sub} from 'date-fns';
import {FormGroup, FormBuilder} from '@angular/forms';

import {findId} from 'src/app/shared/utils/handy-utils';
import {Timeseries} from '../shared/models/timeseries.model';
import {TimeseriesService} from '../shared/services/timeseries.service';
import {ColourService} from '../shared/services/colour.service';
import {LastUrlService} from '../shared/services/last-url.service';


@Component({
  templateUrl: './plot.component.html'
})
export class PlotComponent implements OnInit {

  public datePickerForm: FormGroup;
  public maxDate = new Date();
  public timeseries: Timeseries[];
  public timeseriesDifferencesOnly: any[];
  public ts$: Observable<Timeseries[]>;
  public tso$: Subject<any> = new Subject()
  private graphDto: any;
  public timeseriesParams: any; 
  public tooVague = false;
  public start: Date;
  public end: Date;
  public gettingObs: Boolean = false;
  public obsTally = 0;
  public title = '';
  public subTitle = '';
  public backUrl: Boolean = false;
  public notCancelled: boolean = true;
  public plotsToShow = [];
  public customWindows = ['6-hours', '24-hours', '3-days'];
  public customWindow: string;
  public platformSwitcherWhere = {};
  public observablePropertyWhere = {};
  public getTimeseriesErrorMessage = '';
  public getObservationsErrorMessage = '';
  public suggestedWindow = null;
  public needToRefreshTimeseries = true;
  
  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private timeseriesService: TimeseriesService,
    private colours: ColourService,
    private lastUrlService: LastUrlService,
    private fb: FormBuilder
  ) {}


  ngOnInit(): void {

    this.datePickerForm = this.fb.group({
      window: ['']
    });

    this.listenForDatePickerWindowChanges();
    
    this.route.queryParams.subscribe(params => {

      this.timeseriesParams = omit(params, ['timeseriesId', 'start', 'end', 'customWindow']);
      if (params.timeseriesId) {
        this.timeseriesParams.id__in = params.timeseriesId;
      }
      if (!this.timeseriesParams.id__in && (!this.timeseriesParams.observedProperty || !this.timeseriesParams.unit)) {
        this.tooVague = true;
      }

      if (params.customWindow) {
        this.customWindow = params.customWindow;
        this.setStartAndEndFromCustomWindow(this.customWindow);
      } else if (!params.start && !params.end) {
        this.customWindow = this.customWindows[0];
        this.setStartAndEndFromCustomWindow(this.customWindow);    
      } else {
        this.customWindow = undefined;
        this.end = params.end ? new Date(params.end) : new Date();
        const defaultDifference = 1000 * 60 * 60 * 6;
        this.start = params.end ? new Date(params.start) : new Date(this.end.getTime() - defaultDifference);
      }

      this.datePickerForm.controls['window'].setValue([this.start, this.end], {emitEvent: false});

      if (!this.tooVague) {
        this.notCancelled = true;
        this.plot(this.needToRefreshTimeseries);
      }

    });

    // takes us back the correct map view, regardless of changes made here
    this.backUrl = this.lastUrlService.lastUrl;
  }


  public handlePlatformSwitch(newPlatformId: string) {
    // If the only query parameter before the switch was the timeseriesId then just updating the platform in the URL won't provide enough query parameters for the page to work, therefore we can re-use the buildPlatformSwitcherWhere function to get the observedProperty and unit we should be using.
    const where = this.buildPlatformSwitcherWhere(this.timeseries, this.timeseriesParams);
    this.needToRefreshTimeseries = true;

    this.router.navigate([], {
      queryParams: {
        ancestorPlatforms__includes: newPlatformId,
        timeseriesId: null, // important to remove this if present
        observedProperty: where.observedProperty,
        unit: where.unit
      },
      queryParamsHandling: 'merge', // keeps any existing query parameters
      relativeTo: this.route
    })
  }


  public handleObservablePropertySwitch({observedProperty, unit}) {
    // If the only query parameter before the switch was the timeseriesId then just updating the observedProperty and unit in the URL could lead to a LOT of timeseries being found, therefore we can re-use the buildObservablePropertySwitcherWhere function to see if there's an ancestorPlatform we can add to the URL
    const where = this.buildObservablePropertySwitcherWhere(this.timeseries, this.timeseriesParams);
    this.needToRefreshTimeseries = true;

    this.router.navigate([], {
      queryParams: {
        observedProperty,
        unit, // assumes there will always be a unit, hopefully this will continue to be the case
        timeseriesId: null, // important to remove this if present
        ancestorPlatforms__includes: where.ancestorPlatforms__includes || null
      },
      queryParamsHandling: 'merge', // keeps any existing query parameters
      relativeTo: this.route
    })
  }


  private listenForDatePickerWindowChanges() {

    this.datePickerForm.valueChanges.subscribe(({window}) => {

      this.needToRefreshTimeseries = false;

      this.router.navigate([], {
        // N.b. the customWindow query parameter is unset whenever a specific start and end date is used.
        queryParams: {
          start: window[0].toISOString(),
          end: window[1].toISOString(),
          customWindow: null
        },
        queryParamsHandling: 'merge', // keeps any existing query parameters
        relativeTo: this.route
      });

    });

  }


  public goToSuggestedWindow() {

    this.needToRefreshTimeseries = false;

    this.router.navigate([], {
      // N.b. the customWindow query parameter is unset whenever a specific start and end date is used.
      queryParams: {
        start: this.suggestedWindow.start.toISOString(),
        end: this.suggestedWindow.end.toISOString(),
        customWindow: null
      },
      queryParamsHandling: 'merge', // keeps any existing query parameters
      relativeTo: this.route
    });

  }


  private setStartAndEndFromCustomWindow(customWindow: string) {
    const [value, increment] = customWindow.split('-');
    const valueAsNumber = Number(value);
    const durationObject = {};
    durationObject[increment] = value;
    if (check.not.integer(valueAsNumber)) {
      throw new Error(`Invalid customWindow: ${customWindow}`);
    }
    if (!['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'].includes(increment)) {
      throw new Error(`Invalid customWindow: ${customWindow}`);
    }
    const now = new Date();
    this.start = sub(now, durationObject);
    this.end = now;
  } 


  public customWindowToText(customWindow: string) {
    return `last ${customWindow.replace('-', ' ')}`;
  }


  public customWindowSelected(customWindow: string) {

    this.needToRefreshTimeseries = false;

    this.router.navigate([], {
      queryParams: {
        customWindow,
        start: null, // we want to unset the start and end dates
        end: null
      },
      queryParamsHandling: 'merge', // keeps any existing query parameters
      relativeTo: this.route
    });

  }


  private buildPlatformSwitcherWhere(timeseries: Timeseries[], timeseriesParams: any): any {

    const where: any = {};

    if (timeseriesParams.observedProperty && timeseriesParams.unit) {
      where.observedProperty = timeseriesParams.observedProperty;
      where.unit = timeseriesParams.unit
    } else if (timeseries.length > 0) {
      where.observedProperty = findId(timeseries[0].observedProperty);
      where.unit = findId(timeseries[0].unit);
    }

    const {same} = this.compareTimeseries(timeseries);

    const extraProps = ['disciplines', 'hasFeatureOfInterest'];

    extraProps.forEach((prop) => {
      if (same.includes(prop)) {
        if (timeseries[0]) {
          if (check.nonEmptyArray(timeseries[0][prop])) {
            where[prop] = timeseries[0][prop].map(findId);
          } else if (check.assigned(timeseries[0][prop])) {
            where[prop] = findId(timeseries[0][prop]);
          }
        }
      }
    })

    return where;
  }


  private buildObservablePropertySwitcherWhere(timeseries: Timeseries[], timeseriesParams: any): any {
    if (this.timeseriesParams.ancestorPlatforms__includes) {
      return {
        ancestorPlatforms__includes: this.timeseriesParams.ancestorPlatforms__includes
      };
    } else {
      const where: any = {};
      if (timeseries.length === 1 && timeseries[0].ancestorPlatforms) {
        where.ancestorPlatforms__includes = findId(timeseries[0].ancestorPlatforms[0]);
      }
      return where;
    }
  }


  private async plot(refreshTimeseries = true) {

    // When all that's changed is the timeframe, then there's no need to update the timeseries again.
    if (refreshTimeseries) {
      this.timeseries = await this.getTimeseries();
      const titles = this.buildTitles(this.timeseries);
      this.title = titles.title;
      this.subTitle = titles.subTitle;
      this.timeseriesDifferencesOnly = this.stripTimeseriesDownToJustDifferences(this.timeseries);
      this.selectPlotsToShow();

      this.platformSwitcherWhere = this.buildPlatformSwitcherWhere(this.timeseries, this.timeseriesParams);
      this.observablePropertyWhere = this.buildObservablePropertySwitcherWhere(this.timeseries, this.timeseriesParams);
    }

    this.timeseriesDifferencesOnly.forEach((ts, idx) => {
      ts.colours = this.colours.chartColours(idx);
    })

    if (this.timeseries.length > 0) {

      this.graphDto = {
        label: this.timeseries[0].observedProperty.label,
        symbol: this.timeseries[0].unit.symbol,
        observedPropertyId: this.timeseries[0].observedProperty.id,
        unitId: this.timeseries[0].unit.id,
        tso: []
      }

      this.timeseries.forEach((ts, idx) => {
        this.graphDto.tso[idx] =  { 
          id: ts.id, 
          colours: this.colours.chartColours(idx),
          query: {
            resultTime: {
              gte: this.start.toISOString(),
              lte: this.end.toISOString()
            },
            offset: 0,
            sortBy: 'resultTime',
            sortOrder: 'desc',
            flags: {
              exists: false
            }
          },
          observations: [],
        }
      });

      this.obsTally = 0;
      this.gettingObs = true;
      this.getObservationsErrorMessage = '';
      this.suggestedWindow = null;

      for (let n = 0; n < this.graphDto.tso.length; n++) {
        try {
          this.graphDto.tso[n] = await this.callApi(this.graphDto.tso[n], 0);
        } catch (err) {
          console.error(`Error getting timeseries observations: ${err.message}`);
          this.getObservationsErrorMessage = `Error getting observations: ${err.message}`;
          this.gettingObs = false;
          break;
        }
        if (n + 1 === this.graphDto.tso.length) {
          // console.log('emit')
          this.gettingObs = false;
          this.tso$.next(this.graphDto);
        }               
      }

      if (this.obsTally === 0 && this.getObservationsErrorMessage === '') {
        this.getObservationsErrorMessage = 'No data for the period selected';
        const latestTimeseries = maxBy(this.timeseries, 'endDate');
        let maxEndDate;
        if (latestTimeseries) {
          maxEndDate = new Date(latestTimeseries.endDate);
        }
        if (maxEndDate) {
          this.suggestedWindow = {
            start: sub(maxEndDate, {hours: 3}),
            end: maxEndDate
          }
        }
      }

    }
  }


  private getTimeseries(): Promise<Timeseries[]> {

    const options = {
      populate: [
        'unit',
        'observedProperty', 
        'disciplines', 
        'aggregation', 
        'hasFeatureOfInterest',
        'usedProcedures',
        'hasDeployment',
        'ancestorPlatforms',
        'madeBySensor'
      ]
    }

    this.getTimeseriesErrorMessage = '';

    return this.timeseriesService.getTimeSeriesByQuery(this.timeseriesParams, options)
    .pipe(
      catchError((err) => {
        this.getTimeseriesErrorMessage = err.message;
        return throwError(err);
      }), 
      map(({data}) => data)
    )
    .toPromise()
  }


  private async callApi(call, count) {
    
    count++;
    const r = await this.timeseriesService.getTimeseriesObservations(call.id, call.query).toPromise();
    
    r.data.forEach(item => call.observations.push(item))

    this.obsTally += r.data.length;
      
    // The number here limits how many consecutive observations requests can be made per timeseries. Basically a means of stopping a really silly request being made.
    // TODO: Alternatively you may want to apply a limit based on the obsTally? Or only stop (or pause) once a 429 error is returned?
    if (this.notCancelled && count < 50 && r.meta.next) {
      call.query.offset = r.meta.next.offset;
      await this.callApi(call, count)
    }

    // console.log(call.id, count)
    return call;
  }

  /**
   * Track by function for timeseries info panel
   * 
   * @param idx item index
   * @param item item in array
   */
  public trackByFn(idx, item) {
    if (! item) return null;
    return item.id;
  }

  /**
   * Simple function to check which chart type to load
   * If lots of chart types consider replacing with dynamic import.
   */
  public selectPlotsToShow() {

    const columnTypes = ['precipitation-depth', 'lightning-count'];

    const airQualityTypes = [
      'ozone-mass-concentration', 
      'nitrogen-dioxide-mass-concentration',
      'nitrogen-oxides-mass-concentration', 
      'sulphur-dioxide-mass-concentration',
      'pm10-mass-concentration',
      'pm2p5-mass-concentration'
    ];

    const windDirectionTypes = [
      'wind-direction'
    ]

    const totalTypes = [
      'precipitation-depth',
      'lightning-count'
    ]

    // TODO: At some point we may need to consider other parameters such as the unit.

    const choices = [];

    if (columnTypes.includes(this.timeseriesParams.observedProperty)) {
      choices.push('column-chart');
    } else if (airQualityTypes.includes(this.timeseriesParams.observedProperty)) {
      choices.push('air-quality-line-chart');
    } else if (windDirectionTypes.includes(this.timeseriesParams.observedProperty)) {
      choices.push('wind-direction-line-chart');
    } else {
      choices.push('line-chart');
    }

    if (totalTypes.includes(this.timeseriesParams.observedProperty)) {
      choices.push('total');
    }

    this.plotsToShow = choices;
  }


  // This should be able to handle both populated and unpopulated properties
  private stripTimeseriesDownToJustDifferences(timeseries): any[] {

    const {same: keysThatNeedDeleting} = this.compareTimeseries(timeseries);

    const stripedTimeseries = cloneDeep(timeseries);

    stripedTimeseries.forEach((timeseries) => {
      keysThatNeedDeleting.forEach((key) => {
        delete timeseries[key];
      })
    });
    
    return stripedTimeseries;
  }


  private compareTimeseries(timeseries): {same: string[], missing: string[], varies: string[]} {

    const keysToCompare = [
      'observedProperty',
      'aggregation',
      'unit',
      'madeBySensor',
      'ancestorPlatforms',
      'disciplines',
      'hasDeployment',
      'hasFeatureOfInterest'
    ];

    const idStruct = {};

    // What this is doing is creating a list of all the ids it finds for each of these properties, so we can then find the unique values. If there is more than one unique value then it is a property that varies.
    keysToCompare.forEach((key) => {
      idStruct[key] = [];
      // Loop though the timeseries
      timeseries.forEach((ts) => {

        if (check.not.assigned(ts[key])) {
          idStruct[key].push(null);

        } else if (check.array(ts[key])) {
          const arrayIds = [];
          ts[key].forEach((item) => {
            if (check.nonEmptyString(item)) {
              arrayIds.push(item);
            } else if (check.nonEmptyObject(item)) {
              arrayIds.push(item.id)
            }
          })
          // Because uniq doesn't work on an array of arrays we'll use JSON.stringify to produce and array of strings.
          idStruct[key].push(JSON.stringify(arrayIds));

        } else if (check.nonEmptyString(ts[key])) {
          idStruct[key].push(ts[key]);
        } else if (check.nonEmptyObject) {
          idStruct[key].push(ts[key].id);
        }

      })
    });

    // Leave just unique values
    const idStructUniq = {};
    Object.keys(idStruct).forEach((key) => {
      idStructUniq[key] = uniq(idStruct[key]);
    });

    const output = {
      same: [], // these properties are the same for all timeseries 
      missing: [], // these properties are missing from all timeseries
      varies: [] // the properties vary between timeseries.
    }

    Object.keys(idStructUniq).forEach((key) => {
      if (idStructUniq[key].length === 1) {
        if (idStruct[key][0] === null) {
          output.missing.push(key);
        } else {
          output.same.push(key);
        }
      } else {
        output.varies.push(key);
      }
    })

    return output;

  }


  buildTitles(timeseries): {title: string; subTitle: string} {

    const {same} = this.compareTimeseries(timeseries);

    let title = '';

    if (same.includes('observedProperty')) {
      title += `${timeseries[0].observedProperty.label} `;
    }

    title += 'observations ';

    let subTitle = '';
    
    if (same.includes('madeBySensor')) {
      `Made by ${timeseries[0].madeBySensor.label}. `;
    }

    if (same.includes('ancestorPlatforms')) {
      const platformLabels = timeseries[0].ancestorPlatforms.map((platform) => platform.label).reverse();
      subTitle += `From ${platformLabels.join(' which is hosted by ')}. `
    }

    if (same.includes('hasDeployment')) {
      subTitle += `Collected as part of the ${timeseries[0].hasDeployment.label} deployment. `
    }

    if (same.includes('hasFeatureOfInterest')) {
      subTitle += `Studying ${timeseries[0].hasFeatureOfInterest.label}. `;
    }

    return {title, subTitle};

  }

  /**
   * Handles the conditionally displayed back button, so user
   * can return to the map view they were last on
   */
  public back(): void {
    this.lastUrlService.back();
  }
}
