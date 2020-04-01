import { Component, OnInit, PlatformRef } from '@angular/core';
import { PlatformService } from 'src/app/platform/platform.service';
import { Platform } from 'src/app/platform/platform.class';

@Component({
    selector: 'buo-home-page',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

    public showPanel = false;
    public selectedPlatform: Platform;
    public childPlatforms: Platform[];

    public zoom = 11;
    public center = { lat: 52.480100, lng: -1.896478 };
    public platformMarkers = [];

    constructor(
        private platformService: PlatformService) { }

    ngOnInit(): void {
        this.platformService.getPlatforms({ isHostedBy: { exists: false } })
            .subscribe((platforms) => this.addMarkers(platforms.data));
    }

    /**
     * Iterates through the platforms adding a map marker for each
     *
     * @param platforms : array of platforms
     */
    private addMarkers(platforms: Platform[]) {

        platforms.forEach(platform => {

            this.platformMarkers.push({
                platform,
                position: {
                    lat: platform.location.forMap.lat,
                    lng: platform.location.forMap.lng,
                },
            });

        });

        this.showInformationPanel(this.platformMarkers[0]);
    }

    /**
     * Handles the click event when user selects a platform
     * 
     * @param marker : Google Maps Map Marker
     */
    public showInformationPanel(marker) {
        this.selectedPlatform = marker.platform;

        // console.log(this.selectedPlatform);

        this.platformService.getPlatforms({ ancestorPlatform: { includes: this.selectedPlatform.id } })
            .subscribe((response) => {
                this.childPlatforms = response.data;
                // console.log(this.childPlatforms);
                this.showPanel = true;
            });

    }

}
