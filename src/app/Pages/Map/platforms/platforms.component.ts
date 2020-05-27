import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PlatformService } from 'src/app/platform/platform.service';
import { GoogleMapService } from 'src/app/Components/GoogleMap/google-map.service';
import { MapPinService } from 'src/app/Services/map-pins/map-pin.service';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Platform } from 'src/app/platform/platform.class';
import { MapMarker } from '../../../Interfaces/map-marker.interface';

@Component({
    selector: 'buo-map-platforms',
    template: '<router-outlet></router-outlet> <h1>Deployment Legend</h1>'
})

/**
 * Displays all the top level platforms on the map and subscribes to clicks
 * No real template for this component as 'output' rendered to the map, however,
 * the router-outlet is required for the side panel as that is a child route
 * 
 */
export class PlatformsComponent implements OnInit {

   /**
   * Google Map Marker Service Subscription
   */
  private mapSubscription$: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private map: GoogleMapService,
        private pins: MapPinService,
        private platforms: PlatformService,
    ) {}

    ngOnInit(): void {

      // get the top level platforms
      this.platforms.getPlatforms({
        isHostedBy: {
          exists: false
        }
      })
      .subscribe(({
        data: platforms
      }) => this.addMarkers(platforms));

      // listen for marker clicks of the platform type
      this.mapSubscription$ = this.map.selectedMarker
      .pipe(
        filter((value: MapMarker) => value.type === 'platform')
      )
      .subscribe((marker) => this.router.navigate(['../platforms', marker.id], {
        relativeTo: this.route
      }));
    }

    /**
   * Iterates through the platforms adding a map marker for each
   * Adds the platform detail to each marker, so save a query
   * 
   * @param platforms : array of platforms
   */
  private addMarkers(platforms: Platform[]) {

    const platformsWithALocation = platforms.filter((platform) => {
      return Boolean(platform.location);
    })

    const markers: MapMarker[] = platformsWithALocation.map(platform => this.pins.colouredPin(platform));

    this.map.updateMarkers(markers);
  }
}