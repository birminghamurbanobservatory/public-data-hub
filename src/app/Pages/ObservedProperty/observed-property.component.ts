import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import {  mergeMap, toArray, map } from 'rxjs/operators';

import { TimeSeriesService } from 'src/app/Services/timeseries/timeseries.service';
import { ColourService } from 'src/app/Services/colours/colour.service';

import { Timeseries } from '../../Services/timeseries/timeseries.class';

@Component({
    templateUrl: './observed-property.component.html'
})
export class ObservedPropertyComponent implements OnInit {

    private timeseries: Timeseries[];
    public ts$: Observable<Timeseries[]>;
    public tso$: Subject<any> = new Subject()

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
        .pipe(map(({data}) => data))
        .toPromise()
    }
    private graphDto: any;
    public async timeWindowHandler(window: { start: string, end: string }) {

        if (! this.timeseries) {
            this.timeseries = await this.getTimeseries()
        }

        if (this.timeseries.length > 0) {

            this.graphDto = {
                label: this.timeseries[0].observedProperty.label,
                symbol: this.timeseries[0].unit.symbol,
                tso: []
            }

            this.timeseries.map((ts, idx) => {
                this.graphDto.tso[idx] =  { 
                    id: ts.id, 
                    colours: this.colours.chartColours(idx),
                    query: {
                        resultTime: {
                            gte: window.start,
                            lte: window.end,
                        },
                        offset: 0,
                        sortBy: 'resultTime',
                        sortOrder: 'desc',
                    },
                    observations: [],
                }
            });

            for (let n = 0; n < this.graphDto.tso.length; n++) {
                this.graphDto.tso[n] = await this.callApi(this.graphDto.tso[n], 0);
                if (n + 1 === this.graphDto.tso.length) {
                    console.log('emit')
                    this.tso$.next(this.graphDto);
                }                
            }

        }
    }

    private async callApi(call, count) {
        
        count++;
        const r = await this.timeseriesService.getTimeseriesObservations(call.id, call.query).toPromise();
        
        r.data.forEach(item => call.observations.push(item))
            
        if (count < 10 && r.meta.next) {
            call.query.offset = r.meta.next.offset;
            await this.callApi(call, count)
        }

        console.log(call.id, count)
        return call;
    }

    public trackByFn(idx, item) {
        if (! item) return null;
        return item.id;
    }
}
