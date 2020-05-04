import { Injectable } from '@angular/core';
import { Subject, forkJoin, Observable } from 'rxjs';

import { switchMap, mergeMap} from 'rxjs/operators';

import { Observation } from 'src/app/observation/observation.class';
import { ObservationService } from 'src/app/observation/observation.service';
import { Sensor } from 'src/app/sensor/sensor.class';
import { TimeSeriesService } from 'src/app/Services/timeseries/timeseries.service';

@Injectable({
    providedIn: 'root',
})
export class ObservationModalService {

    private observationSource = new Subject();
    public observation = this.observationSource.asObservable();

    constructor(
        private observationService: ObservationService,
        private timeseriesService: TimeSeriesService,
    ) {}

    /**
     * Emits an observation id
     * 
     * @param id : id of an observation
     */
    public observationSelected(id: string) {
        this.observationSource.next(id);
    }

    public observationInfo(): Observable<{ observation: Observation; timeseries; earliest: Observation; }> {
        
        return this.observation
            .pipe(
                switchMap((id: string) => this.observationService.getObservation(id)),
                mergeMap(
                    (obs: Observation) => forkJoin({
                        timeseries: this.timeseriesService.getTimeseriesById(obs.inTimeseries),
                        earliest: this.observationService.getFirstObservation(obs.observedProperty["@id"], obs.ancestorPlatforms[0]),
                    }), (observation, forkJoin) => {
                        return { observation, ...forkJoin }
                    })
            )

    }
}