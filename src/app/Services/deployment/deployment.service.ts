import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { ColourService } from '../colours/colour.service';

import { environment } from './../../../environments/environment';
import { Deployment } from 'src/app/Interfaces/deployment.interface';
import { Collection } from 'src/app/shared/collection';

@Injectable({
    providedIn: 'root'
})
export class DeploymentService {

    constructor(
        private http: HttpClient,
        private colours: ColourService,
    ) {}


    public getDeployments() {
        return this.http
            .get(`${environment.apiUrl}/deployments`)
            .pipe(
                map((response: Collection) => response.member),
                map(items => items.map(item => this.transform(item))),
            )
    }


    public getDeployment(id: string) {
        return this.http
            .get(`${environment.apiUrl}/deployments/${id}`)
            .pipe(
                map((deployment: Deployment) => this.transform(deployment))
            )
    }


    private transform(item: Deployment): Deployment {
        const colour = this.colours.generateHexColour(item['@id']);

        return Object.assign(item, {
            id: item['@id'],
            colour,
        });
    }
}