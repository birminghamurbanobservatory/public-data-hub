import { Injectable } from '@angular/core';
import { ObservationService } from 'src/app/observation/observation.service';

@Injectable({
    providedIn: 'platform',
})
export class ObservedPropertyService {

    constructor(
        private observationService: ObservationService,
    ) {}

    public getObservations(property: string) {
        return this.observationService.getObservations({
            disciplines: {
                includes: 'Meteorology'
            },
            observedProperty: property,
            flags: {
                exists: false
            },
            location: {
                exists: true
            },
            resultTime: {
                gte: '2020-03-09T10:31:38Z'
            }
        }, {
            onePer: 'sensor'
            // Haven't bothered to populate here, as I don't think we need to.
        });
    }

}