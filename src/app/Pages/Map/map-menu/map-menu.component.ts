import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import {isMatch} from 'lodash';

@Component({
  selector: 'buo-map-menu',
  templateUrl: './map-menu.component.html',
})
export class MapMenuComponent implements OnInit {

  public options = [
    {
      id: '-top-level-platforms-',
      name: 'Sensor Platforms'
    },
    {
      id: 'air-temperature',
      name: 'Air Temperature',
      queryParams: {
        observedProperty: 'air-temperature',
        unit: 'degree-celsius',
        disciplines__includes: 'meteorology',
        // include hasFeatureofInterest too?
        flags__exists: 'false', // give as a string otherwise _.isMatch below won't work
        aggregation__in: 'instant,average',
        duration__lt: '3630' // allows for averages up to about an hour 
      }
    },
    {
      id: 'relative-humidity',
      name: 'Relative Humidity',
      queryParams: {
        observedProperty: 'relative-humidity',
        disciplines__includes: 'meteorology',
        unit: 'percent',
        aggregation__in: 'instant,average',
        duration__lt: '3630' // allows for averages up to about an hour 
      }
    },
    {
      id: 'wind-speed',
      name: 'Wind Speed',
      queryParams: {
        observedProperty: 'wind-speed',
        disciplines__includes: 'meteorology',
        unit: 'metre-per-second',
        aggregation__in: 'instant,average',
        duration__lt: '3630' // allows for averages up to about an hour
      }
    },
    {
      id: 'precipitation-rate',
      name: 'Precipitation Rate',
      queryParams: {
        observedProperty: 'precipitation-rate',
        disciplines__includes: 'meteorology',
        unit: 'millimetre-per-hour',
        aggregation__in: 'instant,average',
        duration__lt: '3630' // allows for averages up to about an hour 
      }
    },
  ];

  public selectedOption;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}


  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      // In order to select the correct option for the <select> box, check to see if the current query parameters match those listed in the available options.
      const matchingOption = this.options.filter((option) => {
        // Exclude the platform option as it has no queryParams
        return Boolean(option.queryParams)
      }).find((option) => {
        // N.B. A match can still occur even if params has additional properties that the option doesn't
        return isMatch(params, option.queryParams);
      });

      // Default to sensor platforms if a match wasn't found
      console.log(`Match found: ${Boolean(matchingOption)}`);
      let initialOptionId = '';
      if (matchingOption)  {
        initialOptionId = matchingOption.id;
      } else if (!params.observedProperty) {
        // If there's no observedProperty query parameter then changes are the URL is currently /map/platforms and therefore the user is looking at a map of platforms
        initialOptionId = '-top-level-platforms-';
      }

      this.selectedOption = new FormControl(initialOptionId);

      this.listenToOptionChanges();

    })

  }


  listenToOptionChanges() {

    this.selectedOption.valueChanges
    .subscribe((selectedOptionId) => {

      const selectedOption = this.options.find((option) => option.id === selectedOptionId);
      console.log(selectedOption);
      if (selectedOptionId === '-top-level-platforms-') {
        this.showPlatforms();
      } else {
        this.showObservations(selectedOption.queryParams);
      }

    });

  }


  public showPlatforms() {
    this.router.navigate(['/map/platforms']);
  }


  public showObservations(queryParams: any) {
    this.router.navigate(['/map/observations'], {queryParams})
  }
}