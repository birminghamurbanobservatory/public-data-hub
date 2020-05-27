import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'buo-map-observed-property-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent {

  /**
   * Array of observed properties to show in menu
   *  
   */
  public observedProperties = [
    {
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  /**
   * Resets the map to the platforms view via url
   */
  public resetMap() {
    this.router.navigate(['/map/platforms']);
  }

  /**
   * Navigate to the map view for observed properties
   * 
   * @param property : observed property ID
   */
  public showObservedProperty(property: string) {
    this.router.navigate(['./observed-property', property], {
      relativeTo: this.route
    })
  }
}