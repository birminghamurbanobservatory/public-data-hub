import { Component, OnChanges, Input, EventEmitter, Output, OnInit } from '@angular/core';
import {isEqual, sortBy} from 'lodash';
import {TimeseriesService} from 'src/app/Services/timeseries/timeseries.service';
import {FormControl} from '@angular/forms';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import * as check from 'check-types';

interface PlatformOption {
    label: string;
    id: string;
}

@Component({
  selector: 'buo-platform-switcher',
  templateUrl: './platform-switcher.component.html',
  styleUrls: ['./platform-switcher.component.css']
})
export class PlatformSwitcherComponent implements OnInit, OnChanges {

  @Input() where: {
    observedProperty?: string, 
    unit?: string; 
    disciplines?: string[];
    hasFeatureOfInterest: string;
  };
  
  @Output() platformSwitch = new EventEmitter<string>();

  public platformOptions: PlatformOption[] = [];
  public getting = true;
  public selectedPlatformId = new FormControl('');

  constructor(
    private timeseriesService: TimeseriesService
  ) { }


  ngOnInit(): void {
    this.watchForPlatformSelection();
  }


  ngOnChanges(changes): void {
    this.updatePlatformOptions(changes.where.currentValue);
  }


  updatePlatformOptions(where) {

    if (isEqual(where, {})) {
      // If the where object is empty, e.g. at initialisation, then there's nothing for us to work with.
      this.platformOptions = []

    } else {

      this.getting = true;

      this.timeseriesService.getTimeSeriesByQuery(where, {limit: 500, populate: ['ancestorPlatforms']})
      .pipe(
        catchError((err) => {
          this.getting = false;
          this.platformOptions = [];
          return throwError(err);
        })
      )
      .subscribe(({data: timeseries}) => {

        this.getting = false;

        // Now we need to find just the unique top level platform IDs
        const uniqPlatStruct = timeseries.reduce((structSoFar, ts) => {
          if (ts.ancestorPlatforms && ts.ancestorPlatforms.length > 0) {
            structSoFar[ts.ancestorPlatforms[0].id] = {
              label: ts.ancestorPlatforms[0].label
            }
          }
          return structSoFar
        }, {});

        const asArray = Object.keys(uniqPlatStruct).map((key) => {
          return {
            id: key,
            label: uniqPlatStruct[key].label
          }
        })

        this.platformOptions = sortBy(asArray, 'label');
        
      })
      

    }

  }


  private watchForPlatformSelection() {
    this.selectedPlatformId.valueChanges.subscribe((platformId) => {
      if (check.nonEmptyString(platformId)) {
        // Emit this selection
        this.platformSwitch.emit(platformId)
      }
    })
  }


}
