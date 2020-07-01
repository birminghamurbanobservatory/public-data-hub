import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {omit, cloneDeep, uniq} from 'lodash';
import * as check from 'check-types';
import { TimeseriesService } from '../../Services/timeseries/timeseries.service';
import { ColourService } from '../../Services/colours/colour.service';

import { Timeseries } from '../../Services/timeseries/timeseries.class';
import { LastUrlService } from 'src/app/Services/last-url/last-url.service';

@Component({
    templateUrl: './plot.component.html'
})
export class PlotComponent implements OnInit {

    private timeseries: Timeseries[];
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
    constructor (
        private route: ActivatedRoute,
        private router: Router,
        private timeseriesService: TimeseriesService,
        private colours: ColourService,
        private lastUrlService: LastUrlService,
    ) {}


    ngOnInit(): void {

        console.log('Initialising plot component');
        
        this.route.queryParams.subscribe(params => {

            this.timeseriesParams = omit(params, ['timeseriesId', 'start', 'end']);
            if (params.timeseriesId) {
                this.timeseriesParams.id__in = params.timeseriesId;
            }
            if (!this.timeseriesParams.id__in && (!this.timeseriesParams.observedProperty || !this.timeseriesParams.unit)) {
                this.tooVague = true;
            }
            this.end = params.end ? new Date(params.end) : new Date();
            const defaultDifference = 1000 * 60 * 60 * 6;
            this.start = params.end ? new Date(params.start) : new Date(this.end.getTime() - defaultDifference);
            // If the query parameters didn't include start and end dates in the first place, then I don't think it makes sense to reload the page with the default start and end dates applied. 
            // We'll only add the dates to the URL if the datepicker specifically selects a time frame.

            if (!this.tooVague) {
                this.notCancelled = true;
                this.plot();
            }
        });

        // takes us back the correct map view, regardless of changes made here
        this.backUrl = this.lastUrlService.lastUrl;
    }


    handleTimeWindowChange(timeWindow: { start: string, end: string }) {
        console.log(`Time window change event has been received by the plot component`);
        this.router.navigate([], {
            queryParams: timeWindow,
            queryParamsHandling: 'merge', // keeps any existing query parameters
            relativeTo: this.route
        });
    }
    

    public async plot() {

        if (!this.timeseries) {
            this.timeseries = await this.getTimeseries();
            const titles = this.buildTitles(this.timeseries);
            this.title = titles.title;
            this.subTitle = titles.subTitle;
            this.timeseriesDifferencesOnly = this.stripTimeseriesDownToJustDifferences(this.timeseries);
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

            for (let n = 0; n < this.graphDto.tso.length; n++) {
                this.graphDto.tso[n] = await this.callApi(this.graphDto.tso[n], 0);
                if (n + 1 === this.graphDto.tso.length) {
                    console.log('emit')
                    this.gettingObs = false;
                    this.tso$.next(this.graphDto);
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

        // TODO: You may also wish to exclude timeseries whose first and last obs would mean it couldn't possibly occur within the listed timeframe. You would need to include params such as endDate__gt to the where object.
        // Alternatively you could just now show any timeseries which didn't return any observations.

        return this.timeseriesService.getTimeSeriesByQuery(this.timeseriesParams, options)
        .pipe(map(({data}) => data))
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

        console.log(call.id, count)
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
    public chartType() {

        const columnTypes = ['precipitation-depth'];
        const airQualityTypes = [
            'ozone-mass-concentration', 
            'nitrogen-dioxide-mass-concentration',
            'nitrogen-oxides-mass-concentration', 
            'sulphur-dioxide-mass-concentration',
            'pm10-mass-concentration',
            'pm2p5-mass-concentration'
        ];

        if (columnTypes.includes(this.timeseriesParams.observedProperty)) {
            return 'column-chart';
        } else if (airQualityTypes.includes(this.timeseriesParams.observedProperty)) {
            return 'air-quality-line-chart';
        } else {
            return 'line-chart';
        }

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
