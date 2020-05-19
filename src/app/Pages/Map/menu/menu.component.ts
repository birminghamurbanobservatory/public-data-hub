import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'buo-map-menu',
    templateUrl: './menu.component.html',
})
export class MenuComponent {

    @Output() reset: EventEmitter<any> = new EventEmitter();

    @Output() select: EventEmitter<string> = new EventEmitter();

    public observedProperties = [
        { name: 'Air Temperature', value: 'AirTemperature', icon: 'fas fa-temperature-low' },
        { name: 'Relative Humidity', value: 'RelativeHumidity', icon: ''}, 
        { name: 'Wind Speed', value: 'WindSpeed', icon: 'fas fa-wind' },
        { name: 'Precipitation Rate', value: 'PrecipitatonRate', icon: 'fas fa-vial' },
    ];

}