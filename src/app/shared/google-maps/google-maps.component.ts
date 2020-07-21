import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import {GoogleMapService} from './google-map.service';


@Component({
  selector: 'buo-google-map',
  template: `
    <div class="w-full h-full rounded-md z-10" #googlemap></div>
  `
})

export class GoogleMapComponent implements AfterViewInit {

  @ViewChild('googlemap') mapContainer: ElementRef;

  constructor(private googleMapService: GoogleMapService) {}

  ngAfterViewInit() {
    this.googleMapService.createMap(this.mapContainer);
  }
}
