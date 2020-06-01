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
        
        if (observation.observedProperty === 'air-temperature' && observation.hasResult.unit === 'degree-celsius') {
            return this.selectColorFromColorMap(this.jetColorMap, observation.hasResult.value, -20, 40);
        }

        if (observation.observedProperty === 'relative-humidity' && observation.hasResult.unit === 'percent') {
            return this.selectColorFromColorMap(this.brownBlueColorMap, observation.hasResult.value, 0, 100);
        }

        if (observation.observedProperty === 'precipitation-rate' && observation.hasResult.unit === 'millimetre-per-hour') {
            return this.selectColorFromColorMap(this.whiteBlueColorMap, observation.hasResult.value, 0, 15);
        }

        if (observation.observedProperty === 'wind-speed' && observation.hasResult.unit === 'metre-per-second') {
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

    /**
     * Returns a colour 'palette' for a chart
     * If idx exceeeded returns a random colour from the array
     * 
     * @param idx 
     */
    public chartColours(idx: number) {
        const colours = [
            { point: '#4299E1', hover: '#2C5282', line: '#BEE3F8' }, // blue, 500, 800, 200
            { point: '#48BB78', hover: '#276749', line: '#C6F6D5' }, // green
            { point: '#553C9A', hover: '#9F7AEA', line: '#E9D8FD' }, // purple 
            { point: '#ED64A6', hover: '#97266D', line: '#FED7E2' }, // pink
            { point: '#ECC94B', hover: '#975A16', line: '#FEFCBF' }, // yellow
            { point: '#7EA4B2', hover: '#507786', line: '#B7CCD4' },
            { point: '#5D53A3', hover: '#302B54', line: '#A59FCE' },
            { point: '#F56565', hover: '#9B2C2C', line: '#FED7D7' }, // red
            { point: '#ED8936', hover: '#9C4221', line: '#FEEBC8' }, // orange 
            { point: '#CA48D9', hover: '#91219E', line: '#E199EA' },
            { point: '#667EEA', hover: '#434190', line: '#C3DAFE' }, // indigo
            { point: '#00E9B7', hover: '#006B54', line: '#68FFDE' },
        ];

        if (colours[idx]) {
            return colours[idx];
        }

        const rInt = Math.floor(Math.random() * (colours.length - 0 + 1) + 0);

        return colours[rInt]
    }
}