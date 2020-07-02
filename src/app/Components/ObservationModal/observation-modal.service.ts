import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { switchMap, tap} from 'rxjs/operators';

import { Observation } from 'src/app/observation/observation.class';
import { ObservationService } from 'src/app/observation/observation.service';

@Injectable({
    providedIn: 'root',
})
export class ObservationModalService {

    private observationSource = new Subject();
    public observation = this.observationSource.asObservable();

    constructor(
        private observationService: ObservationService
    ) {}

    /**
     * Emits an observation id
     * 
     * @param id : id of an observation
     */
    public observationSelected(id: string) {
        this.observationSource.next(id);
    }

    public observationInfo(): Observable<Observation> {
        
        return this.observation
            .pipe(
                switchMap((id: string) => this.observationService.getObservation(id, {
                    populate: ['unit', 'madeBySensor', 'hasDeployment', 'observedProperty', 'aggregation', 'hasFeatureOfInterest', 'ancestorPlatforms']
                }))
            )

    }
}