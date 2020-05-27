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
import { ColourService } from 'src/app/Services/colours/colour.service';

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

  public deployments$;

  public filter$: Subject<string> = new Subject();

  public selectedDeployment$: BehaviorSubject<any> = new BehaviorSubject('')

  private platforms: Platform[];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private map: GoogleMapService,
        private pins: MapPinService,
        private platformService: PlatformService,
        private deployments: DeploymentService,
        private colours: ColourService,
    ) {}

    ngOnInit(): void {

      // get the deployments for the legend
      this.deployments$ = this.deployments.getDeployments().pipe(
        map((res) => res['member']),
        map((member) => member.map(item => {
          item.colour = this.colours.generateHexColour(item['@id'])
          return item;
        }))
        );
        
      this.filter$.pipe(
        map(d => this.selectedDeployment$.getValue() === d ? '' : d),
        tap((deployment) => this.selectedDeployment$.next(deployment)),
        map(deployment => this.platforms.filter(p => p.inDeployment === deployment)),
        map(platforms => platforms.length ? platforms : this.platforms),
      )
      .subscribe(v => this.addMarkers(v))


      // get the top level platforms
      this.platformService.getPlatforms({
        isHostedBy: {
          exists: false
        }
      })
      .subscribe(({data: platforms}) => {
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

    ngOnDestroy(): void {
      this.mapSubscription$.unsubscribe();
    }

    /**
   * Iterates through the platforms adding a map marker for each
   * Adds the platform detail to each marker, so save a query
   * 
   * @param platforms : array of platforms
   */
  private addMarkers(platforms: Platform[]): void {

    const platformsWithALocation = platforms.filter((platform) => {
      return Boolean(platform.location);
    })

    const markers: MapMarker[] = platformsWithALocation.map(platform => this.pins.colouredPin(platform));

    this.map.updateMarkers(markers);
  }
}