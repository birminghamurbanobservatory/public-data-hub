import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TimeSeriesService } from 'src/app/Services/timeseries/timeseries.service';
import { Timeseries } from '../../Services/timeseries/timeseries.class';

@Component({
    templateUrl: './observed-property.component.html'
})
export class ObservedPropertyComponent implements OnInit {

    public latestTimeseries: Timeseries;
    public earlierTimeseries: Timeseries[];

    constructor (
        private route: ActivatedRoute,
        private timeseriesService: TimeSeriesService,
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
        .subscribe(response => {
            this.latestTimeseries = response.data.shift();
            console.log(this.latestTimeseries);
            this.earlierTimeseries = response.data;
        });
    }
}
