import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ObservationService } from 'src/app/observation/observation.service';
import { Observable } from 'rxjs';
import { Observation } from 'src/app/observation/observation.class';
import {Timeseries} from 'src/app/Services/timeseries/timeseries.class';
import {TimeseriesService} from 'src/app/Services/timeseries/timeseries.service';
import { GoogleMapService } from 'src/app/Components/GoogleMap/google-map.service';
import { MapPinService } from 'src/app/Services/map-pins/map-pin.service';

@Component({
    selector: 'buo-observation-view',
    templateUrl: './observation.component.html',
})
export class ObservationComponent implements OnInit, AfterViewInit {

    public observation$: Observable<Observation>; 
    public timeseries$: Observable<Timeseries>; 

    constructor(
        private route: ActivatedRoute,
        private obsService: ObservationService,
        private timeseriesService: TimeseriesService,
        private mapService: GoogleMapService,
        private pinsService: MapPinService,
    ) {}

    ngOnInit(): void {
        this.observation$ = this.route.paramMap.pipe(
            switchMap((params: Params) => this.getObservation(params.get('id')))
        );
    }

    ngAfterViewInit(): void {
        this.observation$.subscribe(async (observation) => {
            // Get the timeseries so we can find out when the first and last obs of this timeseries was.
            this.timeseries$ = this.timeseriesService.getTimeseriesById(observation.inTimeseries);
            
            const pin = this.pinsService.observationPin(observation);
            await this.mapService.spiderfierMarkers([pin]);
            this.mapService.setMapCenter(pin.position);
        });
    }

    private getObservation(id: string): Observable<Observation> {
        return this.obsService.getObservation(id, {
            populate: ['madeBySensor', 'unit', 'observedProperty', 'disciplines', 'aggregation', 'hasFeatureOfInterest', 'usedProcedures', 'hasDeployment']
        });
    }
}