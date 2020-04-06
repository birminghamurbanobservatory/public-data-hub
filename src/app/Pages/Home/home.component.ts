import { Component, OnInit, PlatformRef } from '@angular/core';
import { PlatformService } from 'src/app/platform/platform.service';
import { Platform } from 'src/app/platform/platform.class';
import { GoogleMapService } from 'src/app/Components/GoogleMap/google-map.service';

@Component({
    selector: 'buo-home-page',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

    public showPanel = false;
    public selectedPlatform: Platform;
    public childPlatforms: Platform[];



    constructor(
        private googleMapService: GoogleMapService,
        private platformService: PlatformService) { }

    ngOnInit(): void {
        this.platformService.getPlatforms({ isHostedBy: { exists: false } })
            .subscribe((platforms) => this.addMarkers(platforms.data));

        this.googleMapService.selectedMarker.subscribe((marker) => this.showInformationPanel(marker));
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
        this.selectedPlatform = marker.platform;

        // console.log(this.selectedPlatform);

        this.platformService.getPlatforms({ ancestorPlatforms: { includes: this.selectedPlatform.id } })
            .subscribe((response) => {
                this.childPlatforms = response.data;
                console.log(this.childPlatforms);
                this.showPanel = true;
            });

    }

}
