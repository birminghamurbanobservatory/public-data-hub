import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { ApiFunctionsService } from '../../shared/api-functions';
import { map } from 'rxjs/operators';
import { Collection } from 'src/app/shared/collection';
import {deeplyRenameKeys} from '../../shared/handy-utils';

@Injectable({
    providedIn: 'root'
})
export class TimeseriesService {

    constructor(
        private http: HttpClient,
        private apiFunctions: ApiFunctionsService,
    ) {}

    /**
     * Retrieve an individual timeseries by Id
     * 
     * @param id : timeseries identifier
     */
    public getTimeseriesById(id, options: {populate?: string[]} = {}) {

        const qs = this.apiFunctions.queryParamsObjectToString(options);
        return this.http.get(`${environment.apiUrl}/timeseries/${id}${qs}`)
        .pipe(
            map((timeseries) => {
                return this.formatTimeseriesForApp(timeseries);
            })
        )

    }

    /**
     * Retrieve one or more timeseries by query params
     * 
     * @param where : query object
     */
    public getTimeSeriesByQuery(where = {}, options: {populate?: string[], limit?: number} = {}) {

        const queryParamsObject = Object.assign({}, where, options);
        const qs = this.apiFunctions.queryParamsObjectToString(queryParamsObject);

        return this.http.get(`${environment.apiUrl}/timeseries${qs}`)
        .pipe(
            map((timeseries: Collection) => {
                return {
                    data: timeseries.member.map(this.formatTimeseriesForApp),
                    meta: timeseries.meta,
                }
            })
        )

    }

    /**
     * Retrieve observations for a timeseries
     * 
     * @param id : timeseries identifier
     */
    public getTimeseriesObservations(id: string, where = {}, options = {}) {

        const defaultOptions = {limit: 1000}; // can go as high as 1000.
        const queryParamsObject = Object.assign({}, where, defaultOptions, options);
        const qs = this.apiFunctions.queryParamsObjectToString(queryParamsObject);

        return this.http.get(`${environment.apiUrl}/timeseries/${id}/observations${qs}`)
        .pipe(
            map((response) => {
                return {
                    meta: response['meta'],
                    data: response['member'].map(this.transformReading)
                }
            })
        )

    }


    formatTimeseriesForApp(asJsonLd): any {
        // @id and @type are super-annoying to work with, so let's change them to id and type
        const forApp = deeplyRenameKeys(asJsonLd, {
            '@id': 'id',
            '@type': 'type'
        });
        return forApp;
    }


    private transformReading(reading) {
        return {
            id: reading['@id'],
            ...reading,
        };
    }

}
