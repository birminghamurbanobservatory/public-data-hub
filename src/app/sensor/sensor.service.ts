import { Injectable } from '@angular/core';
import { Sensor } from './sensor.class';
import { ApiFunctionsService } from '../shared/api-functions';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { cloneDeep } from 'lodash';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  constructor(
    private http: HttpClient,
    private apiFunctions: ApiFunctionsService
  ) { }


  getSensors(where: { isHostedBy: string }): Observable<Sensor[]> {
    const qs = this.apiFunctions.whereToQueryString(where);
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

  formatSensorForApp(asJsonLd): Sensor {
    const forApp = cloneDeep(asJsonLd);
    delete forApp['@context']; // get rid of the JSON-LD context
    forApp.id = forApp['@id']; // Remove the @ from the id so easier to reference in code.
    return forApp;
  }


}
