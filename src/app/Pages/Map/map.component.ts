import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlatformService } from 'src/app/platform/platform.service';
import { Platform } from 'src/app/platform/platform.class';
import { GoogleMapService } from 'src/app/Components/GoogleMap/google-map.service';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ObservationService } from 'src/app/observation/observation.service';
import { MapMarker } from '../../Interfaces/map-marker.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { ObservationModalService } from 'src/app/Components/ObservationModal/observation-modal.service';
import { MapPinService } from 'src/app/Services/map-pins/map-pin.service';

@Component({
    selector: 'buo-map-page',
    templateUrl: './map.component.html'
})

export class MapComponent implements OnInit, OnDestroy {

    /**
     * So we can kill our subscriptions on component destruction
     */
    private destroy$: Subject<boolean> = new Subject<boolean>();
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private googleMapService: GoogleMapService,
        private platformService: PlatformService,
        private observationModalService: ObservationModalService,
        private pins: MapPinService,
    ) { }

    ngOnInit(): void {

        this.setPlatforms();

        this.googleMapService.selectedMarker
            .pipe(
                takeUntil(this.destroy$),
                filter((value: MapMarker) => value.type === 'platform')
                )
            .subscribe((marker) => this.router.navigate(['./platforms', marker.id], { relativeTo: this.route }));
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public setPlatforms() {
        this.platformService.getPlatforms({ isHostedBy: { exists: false } })
            .subscribe(({data: platforms}) => this.addMarkers(platforms));
    }

    /**
     * Iterates through the platforms adding a map marker for each
     * Adds the platform detail to each marker, so save a query
     * 
     * @param platforms : array of platforms
     */
    private addMarkers(platforms: Platform[]) {
        const platformsWithALocation = platforms.filter((platform) => {
            return Boolean(platform.location);
        })
        
        const markers: MapMarker[] = platformsWithALocation.map(platform => this.pins.colouredPin(platform));

        this.googleMapService.updateMarkers(markers);

        // this.showDeploymentPanel(markers[0]); // line for ui dev only, delete!
    }





    public resetHandler() {
        this.router.navigate(['/map']);
        this.setPlatforms();
    }
    
    public selectHandler(property: string) {
        this.router.navigate(['./observed-property', property], { relativeTo: this.route })
    }

}
