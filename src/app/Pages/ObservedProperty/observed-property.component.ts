import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { from, Observable } from 'rxjs';
import {  mergeMap, flatMap, filter, toArray, map } from 'rxjs/operators';

import { TimeSeriesService } from 'src/app/Services/timeseries/timeseries.service';
import { ColourService } from 'src/app/Services/colours/colour.service';

import { Timeseries } from '../../Services/timeseries/timeseries.class';

@Component({
    templateUrl: './observed-property.component.html'
})
export class ObservedPropertyComponent implements OnInit {

    private timeseries: Timeseries[];
    public ts$: Observable<Timeseries[]>;

    private platform: string = null;
    private property: string = null;

    constructor (
        private route: ActivatedRoute,
        private timeseriesService: TimeSeriesService,
        private colours: ColourService,
    ) {}

    ngOnInit(): void {
        this.platform = this.route.snapshot.paramMap.get('platform');
        this.property = this.route.snapshot.paramMap.get('property');
    }
    
    private getTimeseries(): Promise<Timeseries[]> {
        return this.timeseriesService.getTimeSeriesByQuery({ 
            ancestorPlatforms: {
                includes: this.platform,
            },
            observedProperty: this.property
        })
        .pipe(
            mergeMap(({data}) => data),
            map((ts, idx) => {
                    ts.colours = this.colours.chartColours(idx);
                    return ts;
            }),
            toArray()
        )
        .toPromise()
    }
    
    public async windowHandler(window) {

        if (! this.timeseries) {
            this.timeseries = await this.getTimeseries()
        }
        
        this.ts$ = from(this.timeseries)
        .pipe(
            flatMap((ts: Timeseries) => {
                return this.timeseriesService.getTimeseriesObservations(ts.id, {
                    resultTime: {
                        gte: window.start,
                        lte: window.end,
                    }
                }).pipe(
                    filter(obs => obs.length),
                    map(obs => { ts['obs'] = obs; return ts;}),
                    )
                }),
                toArray(),
        )
    }

    public trackByFn(idx, item) {
        if (! item) return null;
        return item.id;
    }
}
