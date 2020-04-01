import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Platform } from './platform.class';
import { HttpClient } from '@angular/common/http';
import { ApiFunctionsService } from '../shared/api-functions';
import { environment } from './../../environments/environment';
import { cloneDeep } from 'lodash';
import { map } from 'rxjs/operators';
import { Collection } from '../shared/collection';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(
    private http: HttpClient,
    private apiFunctions: ApiFunctionsService
  ) { }

  /**
   * Get Platforms
   * @param where - use {isHostedBy: {exists: false}} to get just the top level platforms. Use {ancestorPlatform: {includes: 'some-platform-id'}} to get all descendents of a platform.
   */
  getPlatforms(where?: { isHostedBy?: any; ancestorPlatform?: any }): Observable<{ data: Platform[]; meta: any }> {

    const qs = this.apiFunctions.whereToQueryString(where);

    return this.http.get(`${environment.apiUrl}/platforms${qs}`)
      .pipe(
        map((platformCollection: Collection) => {
          return {
            data: platformCollection.member.map(this.formatPlatformForApp),
            meta: platformCollection.meta
          };
        })
      );

  }


  formatPlatformForApp(asJsonLd): Platform {
    const forApp = cloneDeep(asJsonLd);
    delete forApp['@context']; // get rid of the JSON-LD context
    forApp.id = forApp['@id']; // Remove the @ from the id so easier to reference in code.

    switch (forApp.location.geometry.type) {

      case 'Point':
        forApp.location.forMap = {
          lat: forApp.location.geometry.coordinates[1],
          lng: forApp.location.geometry.coordinates[0]
        };
        break;

    }

    return forApp;
  }

}
