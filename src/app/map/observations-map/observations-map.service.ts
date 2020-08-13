import { Injectable } from '@angular/core';
import {sub} from 'date-fns';
import {ObservationService} from 'src/app/shared/services/observation.service';


@Injectable({
  providedIn: 'platform',
})
export class ObservationsMapService {

  constructor(
    private observationService: ObservationService,
  ) {}

  public getObservations(queryParams) {

    const where = Object.assign({}, queryParams, {
      location: {exists: true}, // In all cases the observation will need to have a location
    });

    // Limit observations to within the last hour if a specific time frame hasn't been set
    if (!queryParams.resultTime__gte || !queryParams.resultTime__lte) {
      const now = new Date();
      where.resultTime__gte = sub(now, {hours: 1}).toISOString();
      where.resultTime__lte = now.toISOString();
    }

    const options = {
      onePer: 'timeseries',
      limit: 500 // could in theory go up as high 1000
      // Haven't bothered to populate here, as I don't think we need to.
    }

    return this.observationService.getObservations(where, options);
  }

}