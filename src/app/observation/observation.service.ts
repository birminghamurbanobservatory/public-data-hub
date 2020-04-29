import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiFunctionsService } from '../shared/api-functions';
import { Observation } from './observation.class';
import { environment } from './../../environments/environment';
import { cloneDeep } from 'lodash';
import { map } from 'rxjs/operators';
import { Collection } from '../shared/collection';
import { HttpClient } from '@angular/common/http';
import { GetObservationsWhere } from './get-observations-where.class';

@Injectable({
  providedIn: 'root'
})
export class ObservationService {

  constructor(
    private http: HttpClient,
    private apiFunctions: ApiFunctionsService
  ) { }


  getObservations(where?: GetObservationsWhere): Observable<{ data: Observation[]; meta: any }> {

    const qs = this.apiFunctions.whereToQueryString(where);

    return this.http.get(`${environment.apiUrl}/observations${qs}`)
      .pipe(
        map((platformCollection: Collection) => {
          return {
            data: platformCollection.member.map(this.formatObservationForApp),
            meta: platformCollection.meta
          }
        })
      )

  }

  /**
   * Fetch a single observation
   * 
   * @param id : an observation id
   */
  getObsersvation(id: string) {
    return this.http.get(`${environment.apiUrl}/observations/${id}`)
      .pipe(
        map((response) => this.formatObservationForApp(response))
      )
  }

  formatObservationForApp(asJsonLd): Observation {
    const forApp = cloneDeep(asJsonLd);
    delete forApp['@context']; // get rid of the JSON-LD context
    forApp.id = forApp['@id']; // Remove the @ from the id so easier to reference in code.
    return forApp;
  }



}
