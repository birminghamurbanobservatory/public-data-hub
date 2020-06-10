import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { ApiFunctionsService } from '../../shared/api-functions';
import { map } from 'rxjs/operators';
import { Collection } from 'src/app/shared/collection';

@Injectable({
    providedIn: 'root'
})
export class TimeSeriesService {

    constructor(
        private http: HttpClient,
        private apiFunctions: ApiFunctionsService,
    ) {}

    /**
     * Retrieve an individual timeseries by Id
     * 
     * @param id : timeseries identifier
     */
    public getTimeseriesById(id) {

        return this.http.get(`${environment.apiUrl}/timeseries/${id}`)

    }

    /**
     * Retrieve one or more timeseries by query params
     * 
     * @param where : query object
     */
    public getTimeSeriesByQuery(where?: Object) {

        const qs = this.apiFunctions.queryParamsObjectToString(where);

        return this.http.get(`${environment.apiUrl}/timeseries${qs}`)
        .pipe(
            map((timeseries: Collection) => {
                return {
                    data: timeseries.member.map(this.transformTimeseries),
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
    public getTimeseriesObservations(id: string, where?: {}) {

        const qs = this.apiFunctions.queryParamsObjectToString(where);

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

    private transformTimeseries(series) {
        return {
            id: series['@id'],
            ...series,
        };
    }

    private transformReading(reading) {
        return {
            id: reading['@id'],
            ...reading,
        };
    }

}
