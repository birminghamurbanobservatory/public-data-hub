import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { isMatch } from 'lodash';
import {sub} from 'date-fns';

import {PlatformDetailModalService} from '../platform-detail-modal/platform-detail-modal.service';

@Component({
  selector: 'buo-map-menu',
  templateUrl: './map-menu.component.html',
})
export class MapMenuComponent implements OnInit {

  public showDatePicker: Boolean = false;
  public hasTimeTravelled = false;

  /**
   * Most recent datetime the user can select in the picker
   */
  public maxDate: string = new Date().toISOString();

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
    {
      id: 'lightning-count',
      name: 'Lightning Count',
      queryParams: {
        observedProperty: 'lightning-count',
        aggregation__in: 'count',
        duration__lt: '3630' // allows for averages up to about an hour 
      }
    },
    {
      id: 'pm-10',
      name: 'PM₁₀',
      queryParams: {
        observedProperty: 'pm10-mass-concentration',
        disciplines__includes: 'atmospheric-chemistry',
        unit: 'microgram-per-cubic-metre',
        aggregation__in: 'instant,average',
        duration__lt: '3630' // allows for averages up to about an hour 
        // TODO: include hasFeatureOfInterst: 'earth-atmosphere' too?
      }
    },
    {
      id: 'no2',
      name: 'NO₂',
      queryParams: {
        observedProperty: 'nitrogen-dioxide-mass-concentration',
        disciplines__includes: 'atmospheric-chemistry',
        unit: 'microgram-per-cubic-metre',
        aggregation__in: 'instant,average',
        duration__lt: '3630' // allows for averages up to about an hour 
      }
    },
    {
      id: 'ozone',
      name: 'Ozone',
      queryParams: {
        observedProperty: 'ozone-mass-concentration',
        disciplines__includes: 'atmospheric-chemistry',
        unit: 'microgram-per-cubic-metre',
        aggregation__in: 'instant,average',
        duration__lt: '3630' // allows for averages up to about an hour 
      }
    }
  ];

  public selectedOption;
  private resultsWindow: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private platformDetailModalService: PlatformDetailModalService
  ) {}


  ngOnInit() {

    this.form = this.fb.group({
      window: ['', [Validators.required]]
    });
    
    this.route.queryParams.subscribe(params => {

      // patch any resultTime in the query params in the datepicker
      // only need the lte as the map only ever shows the last hour of observations
      if (Object.keys(params).includes('resultTime__lte')) {
        this.form.patchValue({ window: params.resultTime__lte});
        this.setResultsWindow(new Date(params.resultTime__lte));
        this.hasTimeTravelled = true;
      }

      // In order to select the correct option for the <select> box, check to see if the current query parameters match those listed in the available options.
      const matchingOption = this.options.filter((option) => {
        // Exclude the platform option as it has no queryParams
        return Boolean(option.queryParams)
      }).find((option) => {
        // N.B. A match can still occur even if params has additional properties that the option doesn't
        return isMatch(params, option.queryParams);
      });

      // Default to sensor platforms if a match wasn't found
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
      this.setResultsWindow(new Date(window))

      const option = this.options.find((option) => option.id === this.selectedOption.value);
      const params = Object.assign({}, option.queryParams, this.resultsWindow)

      this.showObservations(params);
    });

  }

  
  private setResultsWindow(datetime: Date = new Date()) {
    this.resultsWindow = {
      resultTime__lte: datetime.toISOString(),
      resultTime__gte: sub(datetime, {hours: 1}).toISOString() 
    }
  }


  listenToOptionChanges() {

    this.selectedOption.valueChanges
    .subscribe((selectedOptionId) => {

      const selectedOption = this.options.find((option) => option.id === selectedOptionId);

      this.platformDetailModalService.closeModal();
      
      if (selectedOptionId === '-top-level-platforms-') {
        this.showPlatforms();
      } else {
        let params = Object.assign({}, selectedOption.queryParams);
        if (this.hasTimeTravelled) {
          params = Object.assign(params, this.resultsWindow);
        }
        console.log(params);
        this.showObservations(params);
      }

    });
  }

  public jumpToNow() {
    const option = this.options.find((option) => option.id === this.selectedOption.value);
    const params = Object.assign({}, option.queryParams);
    this.hasTimeTravelled = false;
    this.form.controls['window'].setValue('', {emitEvent: false})
    this.setResultsWindow();
    this.showObservations(params);
  }

  public showPlatforms() {
    this.router.navigate(['/map/platforms']);
  }

  public showObservations(queryParams: any) {
    this.router.navigate(['/map/observations'], {queryParams})
  }
}