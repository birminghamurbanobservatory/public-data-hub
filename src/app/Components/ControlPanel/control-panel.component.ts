import { Component, EventEmitter, Output } from '@angular/core';
import { ObservationService } from 'src/app/observation/observation.service';
import { GoogleMapService } from '../GoogleMap/google-map.service';

import * as d3 from 'd3';

@Component({
    selector: 'buo-control-panel',
    templateUrl: './control-panel.component.html',
})

export class ControlPanelComponent {

    constructor(
        private observationService: ObservationService,
        private googleMapService: GoogleMapService,
    ) { }

    public show(info: string) {

        this.observationService.getObservations({
            onePer: 'sensor',
            disciplines: {
                includes: 'Meteorology'
            },
            observedProperty: 'AirTemperature',
            flags: {
                exists: false
            },
            resultTime: {
                gte: '2020-03-09T10:31:38Z'
            }
        }).subscribe((response) => {
            console.log(response)
            this.addMarkers(response.data);
        });
    }

    private addMarkers(data) {

        const markers = data.map((reading) => {

            const icon = {
                path: 'M-15,0a15,15 0 1,0 30,0a15,15 0 1,0 -30,0',
                fillColor: this.tempToColour(reading.hasResult.value),
                fillOpacity: .8,
                strokeWeight: 0,
                scale: 1
            };

            return {
                position: {
                    lat: reading.location.geometry.coordinates[1],
                    lng: reading.location.geometry.coordinates[0],
                },

                options: {
                    clickable: false,
                    label: {
                        text: `${Math.round(reading.hasResult.value)}`,
                        color: 'hsl(249, 100%, 32%)'
                    },
                    icon
                }
            };

        });

        this.googleMapService.updateMarkers(markers);
    }

    public tempToColour(temp) {
        const k = temp + 273.15;
        const n = (k - 253.15) / (313.15 - 253.15);

        const i = d3.interpolateHsl('red', 'blue');
        return i(n);
    }
}