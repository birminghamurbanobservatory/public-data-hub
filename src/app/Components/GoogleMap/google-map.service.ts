import { Injectable, ElementRef } from '@angular/core';
import { MapMarker } from '../../Interfaces/map-marker.interface';

import { Subject } from 'rxjs';
import { OverlappingMarkerSpiderfier } from 'ts-overlapping-marker-spiderfier'

@Injectable({
    providedIn: 'root',
})
export class GoogleMapService {

    private static url: string = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBaFvvfiN49ovEcHKQ5oCGARquxlv8irnA&callback=__onGoogleMapsLoaded';

    private static promise: Promise<any>;

    /**
     * Google map reference
     */
    private map: google.maps.Map;

    /**
     * Spiderfy Map reference
     */
    private spiderfyMap: OverlappingMarkerSpiderfier;

    /**
     * Mechanisum through which service users can track marker clicks
     */
    private selectedMarkerSource = new Subject();
    public selectedMarker = this.selectedMarkerSource.asObservable();

    private static load() {
        // First time 'load' is called?
        if (!GoogleMapService.promise) {

            // Make promise to load
            GoogleMapService.promise = new Promise((resolve) => {

            // Set callback for when google maps is loaded.
            window['__onGoogleMapsLoaded'] = (ev) => {
                resolve(window['google']['maps']);
            };

            // Add script tag to load google maps, which then triggers the callback, which resolves the promise with windows.google.maps.
            const node = document.createElement('script');
            node.src = this.url;
            node.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(node);

            });
        }

        // Always return promise. When 'load' is called many times, the promise is already resolved.
        return GoogleMapService.promise;
    }

    public async createMap(el: ElementRef) {
        await GoogleMapService.load();

        this.map = new google.maps.Map(el.nativeElement, {
            center: new google.maps.LatLng({ lat: 52.480100, lng: -1.896478 }),
            zoom: 12
        });

        this.spiderfyMap = new OverlappingMarkerSpiderfier(this.map, {
            keepSpiderfied: true,
        });
    }

    /**
     * Updates the center point of the map based on the click marker position
     *
     * @param marker : map marker
     */
    public setMapCenter(position) {
        this.map.setCenter(position)
    }

    /**
     * Adds markers to the Spiderfy Map
     * 
     * @param pins : array of pins to be added to the map
     */
    public async spiderfierMarkers(pins: MapMarker[]) {
        await GoogleMapService.load();

        this.spiderfyMap.removeAllMarkers();

        pins.forEach((pin, idx) => {
            let marker = new google.maps.Marker(pin);
            marker.setZIndex(idx); // this to fix the text overlap issue

            marker.addListener('spider_format', function(status) {

                if (status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED) {
                    marker.setOptions({ label: { text: pin['text'], color: pin['color'] }})
                } 
                else if (status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE) {
                    marker.setOptions({ label: { text: '+', color: pin['color'] }})
                }
                else if (status == OverlappingMarkerSpiderfier.markerStatus.UNSPIDERFIABLE) {
                    marker.setOptions({ label: { text: pin['text'], color: pin['color'] }})
                }
                else {
                    marker.setOptions({ label: { text: '+', color: pin['color'] }})
                }
            });

            marker.addListener('spider_click', () => {
                this.map.setCenter(marker.getPosition());
                this.selectedMarkerSource.next(marker);
            });

            this.spiderfyMap.addMarker(marker, () => {})
        });

        this.setMapCenter({ lat: 52.480100, lng: -1.896478 }); // hack to make the spiderfy markers show the '+' when toggle observed properties
    }
}
