import { Injectable } from '@angular/core';
import { ObservationService } from 'src/app/observation/observation.service';

@Injectable({
  providedIn: 'platform',
})
export class ObservationsMapService {

  constructor(
    private observationService: ObservationService,
  ) {}

  public getObservations(queryParams) {

    // In all cases the observation will need to have a location
    const where = Object.assign({}, queryParams, {
      location: {exists: true},
      // TODO: Eventually we'll have a datepicker somewhere that allows a user to select a specific time to look at, but until we have this let's limit observations to just the last hour.
      resultTime: {
        gt: new Date((new Date().getTime()) - (1000 * 60 * 60)).toISOString()
      }
    });

    const options = {
      onePer: 'timeseries',
      limit: 500 // could in theory go up as high 1000
      // Haven't bothered to populate here, as I don't think we need to.
    }

    return this.observationService.getObservations(where, options);
  }

}