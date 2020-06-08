import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ObservationService } from 'src/app/observation/observation.service';
import { Observable } from 'rxjs';
import { Observation } from 'src/app/observation/observation.class';

@Component({
    selector: 'buo-observation-view',
    templateUrl: './observation.component.html',
})
export class ObservationComponent implements OnInit {

    public observation$: Observable<Observation>; 

    constructor(
        private route: ActivatedRoute,
        private os: ObservationService,
    ) {}

    ngOnInit(): void {
        this.observation$ = this.route.paramMap.pipe(
            switchMap((params: Params) => this.getObservation(params.get('id')))
        )
    }

    private getObservation(id: string): Observable<Observation> {
        return this.os.getObservation(id, {
            populate: ['madeBySensor', 'unit', 'observedProperty', 'disciplines', 'aggregation', 'hasFeatureOfInterest', 'usedProcedures', 'hasDeployment']
        });
    }
}