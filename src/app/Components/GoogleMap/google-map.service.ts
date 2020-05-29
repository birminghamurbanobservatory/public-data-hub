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

    private map: google.maps.Map;

    private spiderfyMap: OverlappingMarkerSpiderfier;

    private currentMarkers: google.maps.Marker[] = [];

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
            zoom: 11.5
        });

        this.spiderfyMap = new OverlappingMarkerSpiderfier(this.map, {
            markersWontMove: true,
            markersWontHide: true,
            keepSpiderfied:true,
        });
    }

    private selectedMarkerSource = new Subject();
    public selectedMarker = this.selectedMarkerSource.asObservable();

    /**
     * Adds markers to the normal Google map
     * 
     * @param pins : array of pins to add to the map
     */
    public async updateMarkers(pins: MapMarker[]) {

        await GoogleMapService.load();

        this.clearMarkers();

        this.currentMarkers = pins.map(pin => {            
            let marker =  new google.maps.Marker(
                Object.assign({...pin}, {map: this.map})
            );

            marker.addListener('click', () => {
                this.map.setCenter(marker.getPosition());
                this.selectedMarkerSource.next(marker);
              });

            return marker;
        });
    }

    private clearMarkers() {
        this.currentMarkers.forEach(marker => marker.setMap(null));

        this.spiderfyMap.removeAllMarkers();
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

        this.clearMarkers();

        pins.forEach((pin, idx) => {
            let marker = new google.maps.Marker(pin);

            marker.setZIndex(idx); // this to fix the text overlap issue

            google.maps.event.addListener(marker, 'spider_format', function(status) {

                if (status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED) {
                    marker.setOptions({ label: { text: pin['text'], color: pin['color'] }})
                } 
                else if (status == OverlappingMarkerSpiderfier.markerStatus.UNSPIDERFIABLE) {
                    // do nothing as already set up
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
    }
}
