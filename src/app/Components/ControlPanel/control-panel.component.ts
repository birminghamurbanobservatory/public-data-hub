import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { ObservationService } from 'src/app/observation/observation.service';
import { GoogleMapService } from '../GoogleMap/google-map.service';

import { IconService } from 'src/app/Services/icons/icon.service';
import { MapMarker } from '../../Interfaces/map-marker.interface';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ObservationModalService } from '../ObservationModal/observation-modal.service';

@Component({
    selector: 'buo-control-panel',
    templateUrl: './control-panel.component.html',
})

export class ControlPanelComponent implements OnInit, OnDestroy {

    @Output() reset: EventEmitter<any> = new EventEmitter();

    @Output() closePanel: EventEmitter<any> = new EventEmitter();

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private observationService: ObservationService,
        private googleMapService: GoogleMapService,
        private iconService: IconService,
        private observationModalService: ObservationModalService,
    ) { }

    ngOnInit(): void {

        this.googleMapService.selectedMarker
            .pipe(
                filter((value: MapMarker) => value.type === 'observation'),
                takeUntil(this.destroy$),
            )
            .subscribe((marker: MapMarker) => this.observationModalService.observationSelected(marker.id));
            
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }


    public show(property: string) {

        this.closePanel.emit(); // closes the deployment side panel

        this.observationService.getObservations({
            disciplines: {
                includes: 'Meteorology'
            },
            observedProperty: property,
            flags: {
                exists: false
            },
            resultTime: {
                gte: '2020-03-09T10:31:38Z'
            }
        }, {
            onePer: 'sensor'
            // Haven't bothered to populate here, as I don't think we need to.
        }).subscribe((response) => {
            this.addMarkers(response.data);
        });
    }

    private addMarkers(data) {

        const markers: MapMarker[] = data.map((reading) => {

            const iconFillColour = this.iconService.selectFillColour(reading);
            const iconTextColour = this.iconService.selectTextColour(iconFillColour)

            const icon = {
                path: 'M-15,0a15,15 0 1,0 30,0a15,15 0 1,0 -30,0',
                fillColor: iconFillColour,
                fillOpacity: .8,
                strokeWeight: 0,
                scale: 1
            };

            return {
                type: 'observation',
                id: reading.id,
                position: {
                    lat: reading.location.geometry.coordinates[1],
                    lng: reading.location.geometry.coordinates[0],
                },

                options: {
                    label: {
                        text: `${Math.round(reading.hasResult.value)}`,
                        color: iconTextColour
                    },
                    icon
                }
            };

        });

        this.googleMapService.updateMarkers(markers);
    }

}