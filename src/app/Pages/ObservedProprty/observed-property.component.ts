import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TimeSeriesService } from 'src/app/Services/timeseries/timeseries.service';
import { Timeseries } from '../../Services/timeseries/timeseries.class';
import { ColourService } from 'src/app/Services/colours/colour.service';

@Component({
    templateUrl: './observed-property.component.html'
})
export class ObservedPropertyComponent implements OnInit {

    public timeseries: Timeseries[];

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
                t.colours = this.colours.chartColours(i);
                return t;
            });
            console.log(this.timeseries);
        });
    }
}
