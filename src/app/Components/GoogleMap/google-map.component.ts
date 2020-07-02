import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { GoogleMapService } from './google-map.service';

@Component({
    selector: 'buo-google-map',
    template: `
        <div [ngClass]="classes">
            <div class="w-full h-full rounded-md" #googlemap></div>
        </div>
    `
})

export class GoogleMapComponent implements AfterViewInit {

    @Input() classes: string;

    @ViewChild('googlemap') mapContainer: ElementRef;

    constructor(private googleMapService: GoogleMapService) {}

    ngAfterViewInit() {
        this.googleMapService.createMap(this.mapContainer);
    }
}
