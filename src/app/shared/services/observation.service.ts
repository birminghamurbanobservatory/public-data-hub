import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiFunctionsService } from './api-functions';
import { Observation } from '../models/observation.model';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GetObservationsWhere } from '../models/get-observations-where.model';
import {GetObservationsOptions} from '../models/get-observations-options.model';
import {deeplyRenameKeys} from '../utils/handy-utils';
import {environment} from 'src/environments/environment';
import {Collection} from '../models/collection.model';


@Injectable({
  providedIn: 'root'
})
export class ObservationService {

  constructor(
    private http: HttpClient,
    private apiFunctions: ApiFunctionsService
  ) { }

  getObservations(where: GetObservationsWhere = {}, options: GetObservationsOptions = {}): Observable<{ data: Observation[]; meta: any }> {

    const queryParamsObject = Object.assign({}, where, options);
    const qs = this.apiFunctions.queryParamsObjectToString(queryParamsObject);

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
  getObservation(id: string, options: {populate?: any[]} = {}) {

    const qs = this.apiFunctions.queryParamsObjectToString(options);

    return this.http.get(`${environment.apiUrl}/observations/${id}${qs}`)
      .pipe(
        map((response) => this.formatObservationForApp(response))
      )
  }

  formatObservationForApp(asJsonLd): Observation {
    // @id and @type are super-annoying to work with, so let's change them to id and type
    const forApp: Observation = deeplyRenameKeys(asJsonLd, {
      '@id': 'id',
      '@type': 'type'
    });
    delete forApp['@context']; // get rid of the JSON-LD context
    return forApp;
  }

  /**
   * Utility method to retrieve the eariest observation of a particilar observed property
   * So we do not need to keep writing the query out in the controllers
   * 
   * @param property : observed property name
   * @param platform : ancestor platform id
   */
  public getFirstObservation(property: string, platform: string): Observable<Observation> {
    
    const query = { 
      observedProperty: property, 
      ancestorPlatforms: {
          includes: platform
      }
    };

    const options = {
      limit: 1,
      sortBy: 'resultTime',
      sortOrder: 'asc'
    }

    return this.getObservations(query, options)
      .pipe(map((res) => res.data[0]));
  }

}
