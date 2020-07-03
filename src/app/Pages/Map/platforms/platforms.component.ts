import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { PlatformService } from 'src/app/platform/platform.service';
import { GoogleMapService } from 'src/app/Components/GoogleMap/google-map.service';
import { MapPinService } from 'src/app/Services/map-pins/map-pin.service';

import { Subscription, Subject, BehaviorSubject, concat } from 'rxjs';
import { filter, map, tap, mergeMap, distinct, switchMap, concatMap } from 'rxjs/operators';

import { Platform } from 'src/app/platform/platform.class';
import { MapMarker } from '../../../Interfaces/map-marker.interface';
import { DeploymentService } from 'src/app/Services/deployment/deployment.service';
import { Location } from '@angular/common';
import { PlatformDetailModalService } from '../platform-detail-modal/platform-detail-modal.service';

@Component({
    selector: 'buo-map-platforms',
    templateUrl: './platforms.component.html'
})

/**
 * Displays all the top level platforms on the map and subscribes to clicks
 * No real template for this component as 'output' rendered to the map, however,
 * the router-outlet is required for the side panel as that is a child route
 * 
 */
export class PlatformsComponent implements OnInit, OnDestroy {

  /**
   * Google Map Marker Service Subscription
   */
  private mapSubscription$: Subscription;

  /**
   * Observable collection of deployments
   */
  public deployments$;

  /**
   * Array store of Platform with a location
   */
  private platforms: Platform[];

  /**
   * Emits the value of the currently selected deployment, or empty string
   */
  public selectedDeployment$: Subject<string> = new Subject()

    constructor(
        private route: ActivatedRoute,
        private map: GoogleMapService,
        private pins: MapPinService,
        private platformService: PlatformService,
        private deployments: DeploymentService,
        private location: Location,
        private detailModalService: PlatformDetailModalService,
    ) {}

    ngOnInit(): void {
      // get the deployments for the legend
      this.deployments$ = this.deployments.getDeployments();

      // retrieve and display top level platform on the map by default
      this.platformService.getPlatforms({
        isHostedBy: {
          exists: false
        }
      })
      .pipe(
        map(({data: platforms}) => this.filterThoseWithoutLocation(platforms)),
        tap(platforms => this.platforms = platforms),
      )

      .subscribe(platforms => {
        
        // on page load/refresh get any query params and check for a deployment param
        // if present only display the platforms in that deployment
        const params = this.route.snapshot.queryParams;

        if (['deployment'].every(param => param in params)) {
          platforms = this.platforms.filter(p => p.inDeployment === params.deployment)
          this.selectedDeployment$.next(params.deployment);
        }

        if (['platform'].every(param => param in params)) {
          this.detailModalService.display(params.platform);
        }

        this.addMarkers(platforms)
      });



      // listen for marker clicks of the platform type
      this.mapSubscription$ = this.map.selectedMarker
      .pipe(
        filter((value: MapMarker) => value.type === 'platform')
      )
      .subscribe((marker) => {
        this.navigate({ platform: marker.id });
        this.detailModalService.display(marker.id);
      });
    }

  /**
   * Destroy subscriptions
   * 
   */
  ngOnDestroy(): void {
    this.mapSubscription$.unsubscribe();
  }

  /**
   * Updates the url, have to use location as route causes the map the reload
   * 
   * @param params : query param object
   */
  public navigate(params) {
    const qp = Object.assign({}, this.route.snapshot.queryParams, params); // merge new and existing params
    const qs = Object.keys(qp).filter(key => qp[key] !== null).map(key => `${key}=${qp[key]}`); // filter nulls and map to strings
    this.location.replaceState('map/platforms', qs.join('&'))
  }

  /**
   * Changes the displayed map markers when item in the deployments legend toggled
   * 
   * @param evt : checkbox click
   */
  public checkboxChange(evt) {

    const value = evt.target.checked ? evt.target.value : null;

    const show = value ? this.platforms.filter(p => p.inDeployment === value) 
                       : this.platforms;
    
    this.addMarkers(show);

    // update the url with the selected deployment or remove.
    this.navigate({ deployment: value });
    this.selectedDeployment$.next(value);
  }

  /**
   * Iterates through the platforms creating a marker for each
   * 
   * @param platforms : array of platforms
   */
  private addMarkers(platforms: Platform[]): void {

    const markers: MapMarker[] = platforms.map(platform => this.pins.platformPin(platform));

    this.map.spiderfierMarkers(markers);
  }

  /**
   * Remove platforms that do not have a location
   * 
   * @param platforms : array of top level platforms
   */
  private filterThoseWithoutLocation(platforms: Platform[]): Platform[] {
      return platforms.filter((platform) => Boolean(platform.location));
  }
}