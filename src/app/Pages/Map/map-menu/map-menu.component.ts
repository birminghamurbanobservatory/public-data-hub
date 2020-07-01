import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {isMatch} from 'lodash';

import * as moment from 'moment';

@Component({
  selector: 'buo-map-menu',
  templateUrl: './map-menu.component.html',
})
export class MapMenuComponent implements OnInit {

  public showDatePicker: Boolean = false;

  /**
   * Most recent datetime the user can select in the picker
   */
  public maxDate: string = moment().toISOString();

  /**
   * Form for the date time picker
   */
  public form: FormGroup;

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
        duration__lt: '3630', // allows for averages up to about an hour 

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
  private resultsWindow: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}


  ngOnInit() {
    this.form = this.fb.group({
      window: ['', [Validators.required]]
    });

    this.setResultsWindow();
    
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
        this.showDatePicker = true;
      } else if (!params.observedProperty) {
        // If there's no observedProperty query parameter then changes are the URL is currently /map/platforms and therefore the user is looking at a map of platforms
        initialOptionId = '-top-level-platforms-';
        this.showDatePicker = false;
      }

      this.selectedOption = new FormControl(initialOptionId);

      this.listenToOptionChanges();
    })

    this.form.valueChanges
    .subscribe(({window}) => {
      this.setResultsWindow(window)

      const option = this.options.find((option) => option.id === this.selectedOption.value);
      const params = Object.assign({}, option.queryParams, this.resultsWindow)

      this.showObservations(params);
    });

  }

  
  private setResultsWindow(dt: Date = null) {
    const datetime = dt ? moment(dt) : moment();
    this.resultsWindow = {
      resultTime__lte: datetime.toISOString(),
      resultTime__gte: datetime.subtract(1, 'hour').toISOString(),
    }
  }

  listenToOptionChanges() {

    this.selectedOption.valueChanges
    .subscribe((selectedOptionId) => {

      const selectedOption = this.options.find((option) => option.id === selectedOptionId);
      
      if (selectedOptionId === '-top-level-platforms-') {
        this.showPlatforms();
      } else {
        const params = Object.assign({}, selectedOption.queryParams, this.resultsWindow);
        this.showObservations(params);
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