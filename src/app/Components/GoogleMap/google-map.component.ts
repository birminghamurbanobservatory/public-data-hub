import { Component, OnInit } from '@angular/core';
import { GoogleMapService } from './google-map.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'buo-google-map',
    template: `
        <div class="relative h-full w-full z-10">

            <google-map height="100%" width="100%" [zoom]="zoom" [center]="center$ | async">

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

    /**
     * Map zoom value
     */
    public zoom = 11;

    /**
     * Map center co-ordinates
     * As BS so can change map center when marker clicked
     */
    public center$ = new BehaviorSubject({ lat: 52.480100, lng: -1.896478 });

    /**
     * Observable array of markers
     */
    public markers$: Observable<any>;

    constructor(private googleMapService: GoogleMapService) { }

    ngOnInit(): void {
        this.markers$ = this.googleMapService.mapMarkers;
    }

    /**
     * Click event listener for the map markers
     * 
     * @param marker : clicked map marker
     */
    public markerClicked(marker) {
        this.setMapCenter(marker);
        this.googleMapService.selectMarker(marker);
    }

    /**
     * Updates the center point of the map based on the click marker position
     *
     * @param marker : map marker
     */
    private setMapCenter(marker) {
        this.center$.next(marker.position);
    }
}
