import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { ApiFunctionsService } from '../../shared/api-functions';

@Injectable({
    providedIn: 'root'
})
export class TimeSeriesService {

    constructor(
        private http: HttpClient,
        private apiFunctions: ApiFunctionsService,
    ) {}

    public getTimeSeries(where?: Object) {

        const qs = this.apiFunctions.whereToQueryString(where);

        return this.http.get(`${environment.apiUrl}/timeseries${qs}`)
    }
}
