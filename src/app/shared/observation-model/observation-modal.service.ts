import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { switchMap} from 'rxjs/operators';

import {ObservationService} from '../services/observation.service';
import {Observation} from '../models/observation.model';


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

  public observationInfo(id: string): Observable<Observation> {
      return this.observationService.getObservation(id, {
        populate: ['unit', 'madeBySensor', 'hasDeployment', 'observedProperty', 'aggregation', 'hasFeatureOfInterest', 'ancestorPlatforms']
      });
  }
}