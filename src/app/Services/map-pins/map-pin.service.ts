import { Injectable } from '@angular/core';

import { ColourService } from '../colours/colour.service';

@Injectable({
    providedIn: 'root'
})
export class MapPinService {

    constructor(
        private colours: ColourService,
    ) {}

    public circle(observation) {
        
        const iconFillColour = this.colours.selectFillColour(observation);
        const iconTextColour = this.colours.selectTextColour(iconFillColour)

        const icon = {
            path: 'M-15,0a15,15 0 1,0 30,0a15,15 0 1,0 -30,0',
            fillColor: iconFillColour,
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 1
        };

        return {
            type: 'observation',
            id: observation.id,
            position: {
                lat: observation.location.geometry.coordinates[1],
                lng: observation.location.geometry.coordinates[0],
            },

            options: {
                label: {
                    text: `${Math.round(observation.hasResult.value)}`,
                    color: iconTextColour
                },
                icon
            }
        };

    }

    public colouredPin(platform) {

        let colour = this.colours.generateHexColour(platform.inDeployment)

        const icon = {
            path: 'M-15,0a15,15 0 1,0 30,0a15,15 0 1,0 -30,0',
            fillColor: colour,
            fillOpacity: 1,
            strokeWeight: 3,
            scale: 0.7
        };


        return {
            type: 'platform',
            id: platform.id,
            position: {
                lat: platform.location.forMap.lat,
                lng: platform.location.forMap.lng,
            },
            options: {
                icon,
            }
        };
    }
}