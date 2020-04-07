import { Component, OnInit, PlatformRef, OnDestroy } from '@angular/core';
import { PlatformService } from 'src/app/platform/platform.service';
import { Platform } from 'src/app/platform/platform.class';
import { GoogleMapService } from 'src/app/Components/GoogleMap/google-map.service';
import { tap, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'buo-home-page',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit, OnDestroy {

    private destroy$: Subject<boolean> = new Subject<boolean>();
    public showPanel = false;
    public platformDetail;

    constructor(
        private googleMapService: GoogleMapService,
        private platformService: PlatformService
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
     *
     * @param platforms : array of platforms
     */
    private addMarkers(platforms: Platform[]) {

        const markers = platforms.map(platform => {

            return {
                platform,
                position: {
                    lat: platform.location.forMap.lat,
                    lng: platform.location.forMap.lng,
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

        this.platformService.getPlatform(marker.platform.id, { nest: true })
            .subscribe((response) => {
                console.log(response);
                this.platformDetail = response;
                this.showPanel = true;
            });

    }

}
