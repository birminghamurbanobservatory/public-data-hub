import { Injectable } from '@angular/core';
import { MapMarker } from '@angular/google-maps';

import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root', // need to change to local
})
export class GoogleMapService {

    private mapMarkersSource = new BehaviorSubject([]);
    public mapMarkers = this.mapMarkersSource.asObservable();

    private selectedMarkerSource = new Subject();
    public selectedMarker = this.selectedMarkerSource.asObservable();

    public updateMarkers(markers: any) {
        this.mapMarkersSource.next(markers);
    }

    public selectMarker(marker) {
        this.selectedMarkerSource.next(marker);
    }
}
