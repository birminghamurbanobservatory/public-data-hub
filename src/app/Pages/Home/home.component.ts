import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlatformService } from 'src/app/platform/platform.service';
import { Platform } from 'src/app/platform/platform.class';
import { GoogleMapService } from 'src/app/Components/GoogleMap/google-map.service';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ObservationService } from 'src/app/observation/observation.service';
import { Observation } from 'src/app/observation/observation.class';
import { MapMarker } from '../../Interfaces/map-marker.interface';

@Component({
    selector: 'buo-home-page',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit, OnDestroy {

    /**
     * So we can kill our subscriptions on component destruction
     */
    private destroy$: Subject<boolean> = new Subject<boolean>();
    
    /**
     * Whether the Deployment Panel is visible
     */    
    public showPanel = false;
    
    /**
     * Top level platform user has selected to view
     */
    public platformDetail: Platform;
    
    /**
     * Latest observations for top level platform
     */
    public latestObservations: Observation[] = [];

    constructor(
        private googleMapService: GoogleMapService,
        private platformService: PlatformService,
        private observationService: ObservationService,
    ) { }

    ngOnInit(): void {

        this.setPlatforms();

        this.googleMapService.selectedMarker
            .pipe(
                takeUntil(this.destroy$),
                filter((value: MapMarker) => value.type === 'platform')
                )
            .subscribe((marker) => this.showDeploymentPanel(marker));
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public setPlatforms() {
        this.platformService.getPlatforms({ isHostedBy: { exists: false } })
            .subscribe((platforms) => this.addMarkers(platforms.data));
    }

    /**
     * Iterates through the platforms adding a map marker for each
     * Adds the platform detail to each marker, so save a query
     * 
     * @param platforms : array of platforms
     */
    private addMarkers(platforms: Platform[]) {

        const markers: MapMarker[] = platforms.map(platform => {

            return {
                type: 'platform',
                id: platform.id,
                position: {
                    lat: platform.centroid.forMap.lat,
                    lng: platform.centroid.forMap.lng,
                }
            };

        });

        this.googleMapService.updateMarkers(markers);

        // this.showDeploymentPanel(markers[0]); // line for ui dev only, delete!
    }

    /**
     * Handles the click event when user selects a platform
     * Note: marker.platform is the ID of a platform
     * 
     * @param marker : Google Maps Map Marker
     */
    public showDeploymentPanel(marker: MapMarker) {

        this.platformService.getPlatform(marker.id)
            .subscribe((response) => {
                this.platformDetail = response
                this.showPanel = true;
            });


        this.observationService.getObservations({
            onePer: 'sensor',
            ancestorPlatforms: {
              includes: marker.id,
            },
            flags: {
              exists: false
            }
          })
          .subscribe((response) => this.latestObservations = response.data);
    }

}
