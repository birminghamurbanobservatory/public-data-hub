import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ObservationService } from 'src/app/observation/observation.service';
import { Observable } from 'rxjs';
import { Observation } from 'src/app/observation/observation.class';
import {Timeseries} from 'src/app/Services/timeseries/timeseries.class';
import {TimeseriesService} from 'src/app/Services/timeseries/timeseries.service';

@Component({
    selector: 'buo-observation-view',
    templateUrl: './observation.component.html',
})
export class ObservationComponent implements OnInit {

    public observation$: Observable<Observation>; 
    public timeseries$: Observable<Timeseries>; 

    constructor(
        private route: ActivatedRoute,
        private obsService: ObservationService,
        private timeseriesService: TimeseriesService
    ) {}

    ngOnInit(): void {
        this.observation$ = this.route.paramMap.pipe(
            switchMap((params: Params) => this.getObservation(params.get('id')))
        )

        this.observation$.subscribe((observation) => {
            // Get the timeseries so we can find out when the first and last obs of this timeseries was.
            this.timeseries$ = this.timeseriesService.getTimeseriesById(observation.inTimeseries);
        })

    }

    private getObservation(id: string): Observable<Observation> {
        return this.obsService.getObservation(id, {
            populate: ['madeBySensor', 'unit', 'observedProperty', 'disciplines', 'aggregation', 'hasFeatureOfInterest', 'usedProcedures', 'hasDeployment']
        });
    }
}