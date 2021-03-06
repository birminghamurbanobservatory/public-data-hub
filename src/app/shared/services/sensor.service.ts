import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { cloneDeep } from 'lodash';
import { map } from 'rxjs/operators';

import {environment} from 'src/environments/environment';
import {Sensor} from '../models/sensor.model';
import {ApiFunctionsService} from './api-functions';


@Injectable({
  providedIn: 'root'
})
export class SensorService {

  constructor(
    private http: HttpClient,
    private apiFunctions: ApiFunctionsService
  ) { }


  getSensors(where: { isHostedBy: string }): Observable<Sensor[]> {
    const qs = this.apiFunctions.queryParamsObjectToString(where);
    return this.http.get(`${environment.apiUrl}/sensors${qs}`)
      .pipe(
        map((sensorCollection: any) => {
          return sensorCollection.member;
        }),
        map((sensorsJsonLd: any) => {
          return sensorsJsonLd.map(this.formatSensorForApp);
        })
      )
  }

  getSensor(id: string) {
    return this.http.get(`${environment.apiUrl}/sensors/${id}`);
  }

  formatSensorForApp(asJsonLd): Sensor {
    const forApp = cloneDeep(asJsonLd);
    delete forApp['@context']; // get rid of the JSON-LD context
    forApp.id = forApp['@id']; // Remove the @ from the id so easier to reference in code.
    return forApp;
  }


}
