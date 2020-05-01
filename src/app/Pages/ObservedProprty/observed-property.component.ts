import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TimeSeriesService } from 'src/app/Services/timeseries/timeseries.service';

@Component({
    templateUrl: './observed-property.component.html'
})
export class ObservedPropertyComponent implements OnInit {

    constructor (
        private route: ActivatedRoute,
        private timeseriesService: TimeSeriesService,
    ) {}

    ngOnInit(): void {
        this.route.paramMap
        .pipe(
            switchMap((params: ParamMap) => this.timeseriesService.getTimeSeries({ 
                ancestorPlatforms: {
                    includes: params.get('platform'),
                },
                observedProperty: params.get('property')
            }))
        )
        .subscribe((result) => console.log(result));
    }
}
