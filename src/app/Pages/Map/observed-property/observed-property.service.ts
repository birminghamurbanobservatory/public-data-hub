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
    const oneHourAgo = new Date((new Date().getTime()) - (1000 * 60 * 60));
    return this.observationService.getObservations({
      disciplines: {
        includes: 'meteorology'
      },
      observedProperty: property,
      flags: {
        exists: false
      },
      location: {
        exists: true
      },
      resultTime: {
        gte: oneHourAgo.toISOString()
      }
    }, {
      onePer: 'sensor'
      // Haven't bothered to populate here, as I don't think we need to.
    });
  }

}