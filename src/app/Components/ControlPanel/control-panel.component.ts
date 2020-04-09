import { Component, EventEmitter, Output } from '@angular/core';
import { ObservationService } from 'src/app/observation/observation.service';
import { GoogleMapService } from '../GoogleMap/google-map.service';
import * as colormap from 'colormap';
import invert from 'invert-color';

import {Observation} from 'src/app/observation/observation.class';

@Component({
    selector: 'buo-control-panel',
    templateUrl: './control-panel.component.html',
})

export class ControlPanelComponent {

    constructor(
        private observationService: ObservationService,
        private googleMapService: GoogleMapService,
    ) { }

    private jetColorMap = colormap({
        colormap: 'jet',
        nshades: 100,
        format: 'hex',
        alpha: 1
    })

    private brownBlueColorMap = colormap({
        colormap: 'RdBu',
        nshades: 100,
        format: 'hex',
        alpha: 1
    }).reverse();

    private whiteBlueColorMap = colormap({
        colormap: 'velocity-blue',
        nshades: 100,
        format: 'hex',
        alpha: 1
    }).reverse();

    private greePinkColorMap = colormap({
        colormap: 'warm',
        nshades: 100,
        format: 'hex',
        alpha: 1
    }).reverse();


    public show(property: string) {

        this.observationService.getObservations({
            onePer: 'sensor',
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
        }).subscribe((response) => {
            console.log(response)
            this.addMarkers(response.data);
        });
    }

    private addMarkers(data) {

        const markers = data.map((reading) => {

            reading.hasResult.value = 0;

            const iconFillColor = this.selectFillColor(reading);
            const iconTextColor = invert(iconFillColor, true); // the 'true' means only black or white selected

            const icon = {
                path: 'M-15,0a15,15 0 1,0 30,0a15,15 0 1,0 -30,0',
                fillColor: iconFillColor,
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
                        color: iconTextColor
                    },
                    icon
                }
            };

        });

        this.googleMapService.updateMarkers(markers);
    }

    public selectFillColor(observation: Observation) {
        
        if (observation.observedProperty['@id'] === 'AirTemperature' && observation.hasResult.unit['@id'] === 'DegreeCelsius') {
            return this.selectColorFromColorMap(this.greePinkColorMap, observation.hasResult.value, -20, 40);
        }

        if (observation.observedProperty['@id'] === 'RelativeHumidity' && observation.hasResult.unit['@id'] === 'Percent') {
            return this.selectColorFromColorMap(this.jetColorMap, observation.hasResult.value, 0, 100);
        }

        if (observation.observedProperty['@id'] === 'PrecipitationRate' && observation.hasResult.unit['@id'] === 'MillimetrePerHour') {
            return this.selectColorFromColorMap(this.jetColorMap, observation.hasResult.value, 0, 15);
        }

        if (observation.observedProperty['@id'] === 'WindSpeed' && observation.hasResult.unit['@id'] === 'MetrePerSecond') {
            return this.selectColorFromColorMap(this.jetColorMap, observation.hasResult.value, 0, 30);
        }

        // If there's no match, return a default colour.
        return '#333333';

    }

    private selectColorFromColorMap(colorMap, value, minValue, maxValue): string {
        const minColorIdx = 0;
        const maxColorIdx = colorMap.length - 1;
        let colorIdx =  Math.round(((value - minValue) / (maxValue - minValue)) * (maxColorIdx - minColorIdx) + minColorIdx);
        colorIdx = Math.max(minColorIdx, colorIdx);
        colorIdx = Math.min(maxColorIdx, colorIdx);
        return colorMap[colorIdx];
    }

}