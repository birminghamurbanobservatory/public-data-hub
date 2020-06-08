import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PlatformService } from 'src/app/platform/platform.service';
import { GoogleMapService } from 'src/app/Components/GoogleMap/google-map.service';
import { MapPinService } from 'src/app/Services/map-pins/map-pin.service';

import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { filter, map, tap, mergeMap, distinct } from 'rxjs/operators';

import { Platform } from 'src/app/platform/platform.class';
import { MapMarker } from '../../../Interfaces/map-marker.interface';
import { DeploymentService } from 'src/app/Services/deployment/deployment.service';

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
        private router: Router,
        private route: ActivatedRoute,
        private map: GoogleMapService,
        private pins: MapPinService,
        private platformService: PlatformService,
        private deployments: DeploymentService,
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
        map(({data: platforms}) => this.filterThoseWithoutLocation(platforms))
      )
      .subscribe(platforms => {
        this.platforms = platforms;
        this.addMarkers(platforms)
      });

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
   * Destroy subscriptions
   * 
   */
  ngOnDestroy(): void {
    this.mapSubscription$.unsubscribe();
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
    
    this.selectedDeployment$.next(value);
    this.addMarkers(show);
  }

  /**
   * Iterates through the platforms creating a marker for each
   * 
   * @param platforms : array of platforms
   */
  private addMarkers(platforms: Platform[]): void {

    const markers: MapMarker[] = platforms.map(platform => this.pins.colouredPin(platform));

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