import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import {MapPinService} from 'src/app/shared/google-maps/map-pin.service';
import {GoogleMapService} from 'src/app/shared/google-maps/google-maps.service';
import {MapMarker} from 'src/app/shared/google-maps/map-marker.model';
import {ObservationsMapService} from './observations-map.service';
import {ObservationModalService} from 'src/app/shared/observation-model/observation-modal.service';


@Component({
  selector: 'buo-observations-map',
  template: '', // has no template as output onto map
})
export class ObservationsMapComponent implements OnInit, OnDestroy, AfterViewInit {

  private mapSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private pins: MapPinService,
    private map: GoogleMapService,
    private observationsMapService: ObservationsMapService,
    private modal: ObservationModalService,
  ) {}

  ngOnInit(): void {
    
    this.mapSubscription = this.map.selectedMarker
      .pipe(
        filter((value: MapMarker) => value.type === 'observation'),
      )
      .subscribe((marker: MapMarker) => this.modal.observationSelected(marker.id));

  }

  ngAfterViewInit(): void {
    this.route.queryParams.pipe(
      switchMap((params: Params) => this.observationsMapService.getObservations(params))
    )
    .subscribe((response) => this.addMarkers(response.data));
  }

  ngOnDestroy(): void {
    this.mapSubscription.unsubscribe();
  }

  private addMarkers(data) {
    const markers: MapMarker[] = data.map((obs) => this.pins.observationPin(obs));
    this.map.spiderfierMarkers(markers);
  }

}