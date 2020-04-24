import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlatformService } from 'src/app/platform/platform.service';
import { Platform } from 'src/app/platform/platform.class';
import { GoogleMapService } from 'src/app/Components/GoogleMap/google-map.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SensorService } from 'src/app/sensor/sensor.service';
import { ObservationService } from 'src/app/observation/observation.service';
import { Observation } from 'src/app/observation/observation.class';

@Component({
    selector: 'buo-home-page',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit, OnDestroy {

    private destroy$: Subject<boolean> = new Subject<boolean>();
    public showPanel = false;
    public showModal = false;
    public platformDetail: Platform;
    public explorePlatform: Platform;
    public latestObservations: Observation[] = [];

    constructor(
        private googleMapService: GoogleMapService,
        private platformService: PlatformService,
        private sensorService: SensorService,
        private observationService: ObservationService,
    ) { }

    ngOnInit(): void {

        this.platformService.getPlatforms({ isHostedBy: { exists: false } })
            .subscribe((platforms) => this.addMarkers(platforms.data));

        this.googleMapService.selectedMarker
            .pipe(takeUntil(this.destroy$))
            .subscribe((marker) => this.showInformationPanel(marker));
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
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
                // todo: change to id if ui becomes sluggish 
                platform, 
                position: {
                    lat: platform.centroid.forMap.lat,
                    lng: platform.centroid.forMap.lng,
                }
            };

        });

        this.googleMapService.updateMarkers(markers);

        // following line for ui dev
        this.showInformationPanel(markers[0]);
    }

    /**
     * Handles the click event when user selects a platform
     *
     * @param marker : Google Maps Map Marker
     */
    public showInformationPanel(marker) {

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
