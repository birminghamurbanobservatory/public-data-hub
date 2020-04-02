import { Component, EventEmitter, Output } from '@angular/core';
import { ObservationService } from 'src/app/observation/observation.service';
import { GoogleMapService } from '../GoogleMap/google-map.service';

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

        const icon = {
            path: 'M-15,0a15,15 0 1,0 30,0a15,15 0 1,0 -30,0',
            fillColor: 'hsl(216, 99%, 59%)',
            fillOpacity: .8,
            strokeWeight: 0,
            scale: 1
        };

        this.googleMapService.updateMarkers([
            {
                position: {
                    lat: 52.499625,
                    lng: -1.875187
                },

                options: {
                    label: {
                        text: '-4',
                        color: 'hsl(249, 100%, 32%)'
                    },
                    icon
                },
            }
        ])


        // this query does not work! 
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
        }).subscribe((response) => console.log(response));
    }
}