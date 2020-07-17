import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { OverlappingMarkerSpiderfier } from 'ts-overlapping-marker-spiderfier'

import {environment} from '../../../environments/environment';
import {MapMarker} from './map-marker.model';


@Injectable({
  providedIn: 'root',
})
export class GoogleMapService {

  private static url: string = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&callback=__onGoogleMapsLoaded`;

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

  private highlightedMarker: any;

  private defaultMapCenter = {lat: 52.480100, lng: -1.885};

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
      center: new google.maps.LatLng(this.defaultMapCenter),
      zoom: 11
    });

    this.spiderfyMap = new OverlappingMarkerSpiderfier(this.map, {
      keepSpiderfied: true,
      nearbyDistance: 10 // default would have been 20. A lower the number would required more overlap to spiderfy.
    });
  }

  /**
   * Updates the center point of the map based on the click marker position
   */
  public async setMapCenter(position) {
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
      
      let marker: any = new google.maps.Marker(pin);

      marker.setZIndex(idx); // this to fix the text overlap issue

      marker.addListener('spider_format', (status) => {
        if (status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED) {
          marker.setLabel(this.setLabel(pin.labelText, pin.labelColour))
        } 
        else if (status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE) {
          marker.setLabel(this.setLabel('+', pin.labelColour))
        }
        else if (status == OverlappingMarkerSpiderfier.markerStatus.UNSPIDERFIABLE) {
          marker.setLabel(this.setLabel(pin.labelText, pin.labelColour))
        }
        else {
          marker.setLabel(this.setLabel('+', pin.labelColour))
        }
      });

      marker.addListener('spider_click', () => {
        if (this.highlightedMarker) {
          this.unhighlightMarker(this.highlightedMarker);
        }
        this.highlightMarker(marker);
        this.highlightedMarker = marker;
        this.map.setCenter(marker.getPosition());
        this.selectedMarkerSource.next(marker);
      });

      if (marker.initiallyHighlighted) {
        this.highlightMarker(marker);
        this.highlightedMarker = marker;
      }

      this.spiderfyMap.addMarker(marker, () => {})
    });

    this.setMapCenter(this.defaultMapCenter); // hack to make the spiderfy markers show the '+' when toggle observed properties
  }

  private setLabel(text: string, color: string) {
    if (text) {
      return { text, color }
    }

    return null;
  }


  public unhighlightedAnyHighlightedMarker() {
    if (this.highlightedMarker) {
      this.unhighlightMarker(this.highlightedMarker);
      this.highlightedMarker = undefined;
    }
  }


  private highlightMarker(marker: any): MapMarker {
    return this.updateMarkerStrokeWeight(marker, 6);
  }

  private unhighlightMarker(marker: any): MapMarker {
    return this.updateMarkerStrokeWeight(marker, 3);
  }

  private updateMarkerStrokeWeight(marker: any, weight: number): MapMarker {
    const currentIcon = marker.getIcon();
    const newIcon = Object.assign({}, currentIcon, {strokeWeight: weight});
    marker.setIcon(newIcon);
    return marker;
  }


}
