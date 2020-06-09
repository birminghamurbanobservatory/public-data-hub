import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GoogleMapService } from './google-map.service';

@Component({
    selector: 'buo-google-map',
    template: `
        <div class="relative h-full w-full z-10 shadow-lg">
            <div class="w-full h-full rounded-md" #googlemap></div>
        </div>
    `
})

export class GoogleMapComponent implements AfterViewInit {

    @ViewChild('googlemap') mapContainer: ElementRef;

    constructor(private googleMapService: GoogleMapService) { }

    ngAfterViewInit() {
        this.googleMapService.createMap(this.mapContainer);
    }
}
