import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlatformService } from 'src/app/platform/platform.service';
import { Platform } from 'src/app/platform/platform.class';
import { GoogleMapService } from 'src/app/Components/GoogleMap/google-map.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ObservationService } from 'src/app/observation/observation.service';
import { Observation } from 'src/app/observation/observation.class';

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
     * Whether the platform detail model is visable
     */
    public showModal = false;
    
    /**
     * Top level platform user has selected to view
     */
    public platformDetail: Platform;
    
    /**
     * 
     */
    public explorePlatform: Platform;
    
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
            .pipe(takeUntil(this.destroy$))
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

        const markers = platforms.map(platform => {

            return {
                platform, // change this to the platform id, so can work with other map icon clicks. 
                position: {
                    lat: platform.centroid.forMap.lat,
                    lng: platform.centroid.forMap.lng,
                }
            };

        });

        this.googleMapService.updateMarkers(markers);

        //this.showDeploymentPanel(markers[0]); // line for ui dev only, delete!
    }

    /**
     * Handles the click event when user selects a platform
     *
     * @param marker : Google Maps Map Marker
     */
    public showDeploymentPanel(marker) {

        // at the moment detail passed through the marker
        this.platformDetail = marker.platform;
        this.showPanel = true;

        this.observationService.getObservations({
            onePer: 'sensor',
            ancestorPlatforms: {
              includes: this.platformDetail.id,
            },
            flags: {
              exists: false
            }
          })
          .subscribe((response) => this.latestObservations = response.data);
    }

    public showPlatformModal(obs) {
        console.log(obs);

        this.showModal = true;
    }

}
