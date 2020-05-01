import { Injectable } from '@angular/core';
import { Subject, forkJoin, Observable } from 'rxjs';

import { switchMap, mergeMap} from 'rxjs/operators';

import { Observation } from 'src/app/observation/observation.class';
import { ObservationService } from 'src/app/observation/observation.service';
import { SensorService } from 'src/app/sensor/sensor.service';
import { Sensor } from 'src/app/sensor/sensor.class';

@Injectable({
    providedIn: 'root',
})
export class PlatformModalService {

    private observationSource = new Subject();
    public observation = this.observationSource.asObservable();

    constructor(
        private observationService: ObservationService,
        private sensorService: SensorService,
    ) {}

    /**
     * Emits an observation id
     * 
     * @param id : id of an observation
     */
    public observationSelected(id: string) {
        this.observationSource.next(id);
    }

    // this is one ugly and complex query! :-/ One to refactor...
    public observationInfo(): Observable<{ sensor: Sensor; earliest: Observation; observation: Observation; }> {
        
        return this.observation
            .pipe(
                switchMap((id: string) => this.observationService.getObservation(id)),
                mergeMap(
                    (obs: Observation) => forkJoin({
                        sensor: this.sensorService.getSensor(obs.madeBySensor),
                        earliest: this.observationService.getFirstObservation(obs.observedProperty["@id"], obs.ancestorPlatforms[0]),
                    }), (observation, forkJoin) => {
                        return { observation, ...forkJoin }
                    })
            )

    }
}