import { Injectable } from '@angular/core';

import * as colormap from 'colormap';
import invert from 'invert-color';
import { Observation } from 'src/app/observation/observation.class';

@Injectable({
    providedIn: 'root'
})
export class ColourService {

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

    private greenPinkColorMap = colormap({
        colormap: 'warm',
        nshades: 100,
        format: 'hex',
        alpha: 1
    }).reverse();

    public selectFillColour(observation: Observation) {
        
        if (observation.observedProperty === 'AirTemperature' && observation.hasResult.unit === 'DegreeCelsius') {
            return this.selectColorFromColorMap(this.jetColorMap, observation.hasResult.value, -20, 40);
        }

        if (observation.observedProperty === 'RelativeHumidity' && observation.hasResult.unit === 'Percent') {
            return this.selectColorFromColorMap(this.brownBlueColorMap, observation.hasResult.value, 0, 100);
        }

        if (observation.observedProperty === 'PrecipitationRate' && observation.hasResult.unit === 'MillimetrePerHour') {
            return this.selectColorFromColorMap(this.whiteBlueColorMap, observation.hasResult.value, 0, 15);
        }

        if (observation.observedProperty === 'WindSpeed' && observation.hasResult.unit === 'MetrePerSecond') {
            return this.selectColorFromColorMap(this.greenPinkColorMap, observation.hasResult.value, 0, 30);
        }

        // If there's no match, return a default colour.
        return '#333333';
    }

    public selectTextColour(iconFillColor) {
        return invert(iconFillColor, true); // the 'true' means only black or white selected
    }

    private selectColorFromColorMap(colorMap, value, minValue, maxValue): string {
        const minColorIdx = 0;
        const maxColorIdx = colorMap.length - 1;
        let colorIdx =  Math.round(((value - minValue) / (maxValue - minValue)) * (maxColorIdx - minColorIdx) + minColorIdx);
        colorIdx = Math.max(minColorIdx, colorIdx);
        colorIdx = Math.min(maxColorIdx, colorIdx);
        return colorMap[colorIdx];
    }

    /**
     * Generate Hex colour based on an input string
     * 
     * @param string 
     */
    public generateHexColour(string) {
        let hash = 0;

        if (string.length === 0) return '#000000';
        
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }

        let color = '#';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 255;
            color += ('00' + value.toString(16)).substr(-2);
        }

        return color;
    }
}