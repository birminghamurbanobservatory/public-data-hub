import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { switchMap, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { GoogleMapService } from 'src/app/Components/GoogleMap/google-map.service';
import { ObservedPropertyService } from './observed-property.service';
import { ObservationModalService } from 'src/app/Components/ObservationModal/observation-modal.service';
import { MapPinService } from 'src/app/Services/map-pins/map-pin.service';

import { MapMarker } from '../../../Interfaces/map-marker.interface';

@Component({
  selector: 'buo-map-observed-property',
  template: '', // has no template as output onto map
})
export class ObservedPropertyComponent implements OnInit, OnDestroy {

  private mapSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private pins: MapPinService,
    private map: GoogleMapService,
    private observedPropertyService: ObservedPropertyService,
    private modal: ObservationModalService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
        switchMap((params: Params) => this.observedPropertyService.getObservations(params.get('id')))
      )
      .subscribe((response) => this.addMarkers(response.data));

    this.mapSubscription = this.map.selectedMarker
      .pipe(
        filter((value: MapMarker) => value.type === 'observation'),
      )
      .subscribe((marker: MapMarker) => this.modal.observationSelected(marker.id));
  }

  ngOnDestroy(): void {
    this.mapSubscription.unsubscribe();
  }

  private addMarkers(data) {

    const markers: MapMarker[] = data.map((obs) => this.pins.circle(obs));

    this.map.updateMarkers(markers);
  }

}