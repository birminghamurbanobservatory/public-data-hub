import { Component, OnInit } from '@angular/core';
import { GoogleMapService } from './google-map.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'buo-google-map',
    template: `
        <div class="relative h-full w-full z-10">

            <google-map height="100%" width="100%" [zoom]="zoom" [center]="center">

                <map-marker 
                    *ngFor="let marker of markers$ | async" 
                    [position]="marker.position" 
                    [label]="marker.label" 
                    [options]="marker.options" 
                    (mapClick)="markerClicked(marker)">
                </map-marker>

            </google-map>

        </div>
    `
})

export class GoogleMapComponent implements OnInit {

    public zoom = 11;
    public center = { lat: 52.480100, lng: -1.896478 };
    public markers$: Observable<any>;

    constructor(private googleMapService: GoogleMapService) { }

    ngOnInit(): void {
        this.markers$ = this.googleMapService.mapMarkers;
    }

    public markerClicked(marker) {
        this.googleMapService.selectMarker(marker);
    }
}
