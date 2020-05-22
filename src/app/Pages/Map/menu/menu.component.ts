import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'buo-map-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent {

  @Output() reset: EventEmitter < any > = new EventEmitter();

  @Output() select: EventEmitter < string > = new EventEmitter();

  public observedProperties = [{
      name: 'Air Temperature',
      value: 'air-temperature',
      icon: 'fas fa-temperature-low'
    },
    {
      name: 'Relative Humidity',
      value: 'relative-humidity',
      icon: ''
    },
    {
      name: 'Wind Speed',
      value: 'wind-speed',
      icon: 'fas fa-wind'
    },
    {
      name: 'Precipitation Rate',
      value: 'precipitation-rate',
      icon: 'fas fa-vial'
    },
  ];

}