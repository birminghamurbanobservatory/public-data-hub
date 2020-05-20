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
            fillOpacity: .8,
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
            path: 'M12.5,0C5.6,0,0,4.9,0,10.9c0,7.4,11.2,18.3,11.7,18.8c0.4,0.4,1.2,0.4,1.7,0C13.8,29.2,25,18.3,25,10.9C25,4.9,19.4,0,12.5,0z M12.6,14.8c-3,0-5.4-2.2-5.4-4.8s2.4-4.7,5.4-4.7s5.4,2.2,5.4,4.8S15.7,14.8,12.6,14.8z',
            fillColor: colour,
            fillOpacity: 1,
            strokeWeight: .8,
            scale: 1
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