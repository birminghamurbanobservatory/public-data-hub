import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {Observation} from '../shared/models/observation.model';
import {Timeseries} from '../shared/models/timeseries.model';
import {ObservationService} from '../shared/services/observation.service';
import {TimeseriesService} from '../shared/services/timeseries.service';
import {GoogleMapService} from '../shared/google-maps/google-map.service';
import {MapPinService} from '../shared/google-maps/map-pin.service';
import {LastUrlService} from '../shared/services/last-url.service';


@Component({
  selector: 'buo-observation-view',
  templateUrl: './observation.component.html',
})
export class ObservationComponent implements OnInit, AfterViewInit {

  public observation$: Observable<Observation>; 
  public timeseries$: Observable<Timeseries>; 
  public backUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private obsService: ObservationService,
    private timeseriesService: TimeseriesService,
    private mapService: GoogleMapService,
    private pinsService: MapPinService,
    private lastUrlService: LastUrlService,
  ) {}

  ngOnInit(): void {
    this.observation$ = this.route.paramMap.pipe(
      switchMap((params: Params) => this.getObservation(params.get('id')))
    );

    // Crucially this will be undefined if the last page was external to this app, and it won't be updated as query parameters are changed on this page.
    const doNotGoBackTo = ['/download'];
    if (this.lastUrlService.lastUrl && doNotGoBackTo.every((urlSectionToAvoid) => !this.lastUrlService.lastUrl.includes(urlSectionToAvoid))) {
      this.backUrl = this.lastUrlService.lastUrl;
    }
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
      populate: ['ancestorPlatforms', 'madeBySensor', 'unit', 'observedProperty', 'disciplines', 'aggregation', 'hasFeatureOfInterest', 'usedProcedures', 'hasDeployment']
    });
  }

  public back(): void {
    this.router.navigateByUrl(this.backUrl);
  }

}