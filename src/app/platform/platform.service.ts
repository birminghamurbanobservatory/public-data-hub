import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Platform } from './platform.class';
import { HttpClient } from '@angular/common/http';
import { ApiFunctionsService } from '../shared/api-functions';
import { environment } from './../../environments/environment';
import { cloneDeep } from 'lodash';
import { map, tap } from 'rxjs/operators';
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
   * Retrieves individual platform details from given id
   *
   * @param id : string of platform id
   */
  public getPlatform(id: string, where?: { nest?: boolean }) {

    const qs = this.apiFunctions.queryParamsObjectToString(where);

    return this.http.get(`${environment.apiUrl}/platforms/${id}${qs}`)
      .pipe(
        map((platform) => this.formatPlatformForApp(platform))
      );

  }

  /**
   * Get Platforms
   * @param where - use {isHostedBy: {exists: false}} to get just the top level platforms. Use {ancestorPlatform: {includes: 'some-platform-id'}} to get all descendents of a platform.
   */
  getPlatforms(where?: { isHostedBy?: any; ancestorPlatforms?: any; }): Observable<{ data: Platform[]; meta: any }> {

    const qs = this.apiFunctions.queryParamsObjectToString(where);

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

    if (forApp.location) {
      // The location is always a point geometry for platforms
      forApp.location.forMap = {
        lat: forApp.location.geometry.coordinates[1],
        lng: forApp.location.geometry.coordinates[0]
      }
    }

    return forApp;
  }

}
