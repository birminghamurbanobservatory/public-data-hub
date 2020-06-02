import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TimeSeriesService } from 'src/app/Services/timeseries/timeseries.service';
import { Timeseries } from '../../Services/timeseries/timeseries.class';
import { ColourService } from 'src/app/Services/colours/colour.service';
import { forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
    templateUrl: './observed-property.component.html'
})
export class ObservedPropertyComponent implements OnInit {

    public timeseries: Timeseries[];

    public tso$;

    constructor (
        private route: ActivatedRoute,
        private timeseriesService: TimeSeriesService,
        private colours: ColourService,
    ) {}

    ngOnInit(): void {
        this.route.paramMap
        .pipe(
            switchMap((params: ParamMap) => this.timeseriesService.getTimeSeriesByQuery({ 
                ancestorPlatforms: {
                    includes: params.get('platform'),
                },
                observedProperty: params.get('property')
            }))
        )
        .subscribe(({ data }) => {
            this.timeseries = data.map((t, i) => {
                t.colours = this.colours.chartColours(i); // adds a colour property
                return t;
            });
        });
    }

    public windowHandler(window) {
        console.log(window)
        const apiCalls = this.timeseries.map((ts) => {
            return this.timeseriesService.getTimeseriesObservations(ts.id, {
                resultTime: {
                    gte: window.start,
                    lte: window.end,
                }
            })
        });

        this.tso$ = forkJoin(apiCalls)
            .pipe(
                tap(v => console.log(v))
                // map((data) => data.map((set, i) => this.plotData(set, i))),
            )
            // .subscribe((datasets) => this.drawChart(datasets));
    }
}
