import { Component, OnChanges, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {TimeseriesService} from 'src/app/Services/timeseries/timeseries.service';
import {isEqual, sortBy} from 'lodash';
import * as check from 'check-types';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';


interface ObservablePropertyOption {
    label: string; // might include the symbol of the unit too if more than one for this observed property
    observedPropertyId: string;
    unitId: string;
}

@Component({
  selector: 'buo-observable-property-switcher',
  templateUrl: './observable-property-switcher.component.html',
  styleUrls: ['./observable-property-switcher.component.css']
})
export class ObservablePropertySwitcherComponent implements OnInit, OnChanges {

  @Input() where: {
    ancestorPlatforms__includes?: string;
  };
  
  @Output() observablePropertySwitch = new EventEmitter<{observedProperty: string; unit: string}>();

  public observablePropertyOptions: ObservablePropertyOption[] = [];
  public getting = false;
  public selectedObservableProperty = new FormControl('');

  constructor(
    private timeseriesService: TimeseriesService
  ) { }


  ngOnInit(): void {
    this.watchForObservablePropertySelection();
  }


  ngOnChanges(changes): void {

    console.log('Observable property switcher where parameters have changed:');
    console.log(changes.where.currentValue);

    this.updateObservablePropertyOptions(changes.where.currentValue);

  }


  updateObservablePropertyOptions(where) {

    if (isEqual(where, {})) {
      // If the where object is empty, e.g. at initialisation, then there's nothing for us to work with.
      this.observablePropertyOptions = []

    } else {

      this.getting = true;

      this.timeseriesService.getTimeSeriesByQuery(where, {limit: 300, populate: ['observedProperty', 'unit']})
      .pipe(
        catchError((err) => {
          this.getting = false;
          console.log(err);
          this.observablePropertyOptions = [];
          return throwError(err);
        })
      )
      .subscribe(({data: timeseries}) => {

        this.getting = false;
        console.log(`Observable property switcher found ${timeseries.length} matching timeseries`);

        // Now we need to find just the unique top level platform IDs
        const uniqPlatStruct = timeseries.reduce((structSoFar, ts) => {
          if (ts.observedProperty && ts.unit) {
            if (!structSoFar[ts.observedProperty.id]) {
              structSoFar[ts.observedProperty.id] = [];
            }
            const found = structSoFar[ts.observedProperty.id].find((item) => item.unitId === ts.unit.id);
            if (!found) {
              structSoFar[ts.observedProperty.id].push({
                observedPropertyLabel: ts.observedProperty.label,
                observedPropertyId: ts.observedProperty.id,
                unitId: ts.unit.id,
                unitSymbol: ts.unit.symbol
              });
            }
          }
          return structSoFar
        }, {});

        const asArray = [];

        Object.keys(uniqPlatStruct).forEach((key) => {
          const includeUnitInLabel = uniqPlatStruct[key].length > 1;
          uniqPlatStruct[key].forEach((item) => {
            const label = includeUnitInLabel ? `${item.observedPropertyLabel} (${item.unitSymbol})` : item.observedPropertyLabel;
            asArray.push({
              label,
              observedPropertyId: item.observedPropertyId,
              unitId: item.unitId
            });
          })
        })

        this.observablePropertyOptions = sortBy(asArray, 'label');
        
        console.log(`Of which there are ${this.observablePropertyOptions.length} unique options`);

      })
      

    }

  }


  private watchForObservablePropertySelection() {
    this.selectedObservableProperty.valueChanges.subscribe((selected) => {
      if (check.nonEmptyObject(selected)) {
        // Emit this selection
        this.observablePropertySwitch.emit({
          observedProperty: selected.observedPropertyId,
          unit: selected.unitId
        })
      }
    })
  }

}
