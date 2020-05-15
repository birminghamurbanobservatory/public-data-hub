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
            .subscribe(({data: platforms}) => {
                this.addMarkers(platforms)
            });
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

        const markers: MapMarker[] = platformsWithALocation.map(platform => {

            let colour = this.generateHslColour(platform.inDeployment)

            const icon = {
                path: 'M12.5,0C5.6,0,0,4.9,0,10.9c0,7.4,11.2,18.3,11.7,18.8c0.4,0.4,1.2,0.4,1.7,0C13.8,29.2,25,18.3,25,10.9C25,4.9,19.4,0,12.5,0z M12.6,14.8c-3,0-5.4-2.2-5.4-4.8s2.4-4.7,5.4-4.7s5.4,2.2,5.4,4.8S15.7,14.8,12.6,14.8z',
                fillColor: colour,
                fillOpacity: 1,
                strokeWeight: .8,
                scale: 1
            };


            return {
                type: 'platform',
                id: platform.id,
                position: {
                    lat: platform.location.forMap.lat,
                    lng: platform.location.forMap.lng,
                },
                options: {
                    icon,
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
            ancestorPlatforms: {
              includes: marker.id,
            },
            flags: {
              exists: false
            }
          }, {
            onePer: 'timeseries',
            populate: ['observedProperty', 'unit', 'disciplines']
          })
          .subscribe((response) => this.latestObservations = response.data);
    }

    /**
     * Generate hsl colour based on input string
     * 
     * @param string 
     */
    private generateHslColour(string) {
        let hash = 0;

        if (string.length > 0) {
            for (var i = 0; i < string.length; i++) {
                hash = string.charCodeAt(i) + ((hash << 5) - hash);
                hash = hash & hash; // Convert to 32bit integer
            }
        }
        
        return "hsl(" + hash % 360 + ", 80%, 30%)";
    }

}
