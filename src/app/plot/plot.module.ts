import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';

import { PlotComponent } from './plot.component';
import { PlotRoutingModule } from './plot-routing.module';
import { ObservationLoadingModalComponent } from './loading-modal/loading-modal.component';
import { PlatformSwitcherComponent } from './platform-switcher/platform-switcher.component';
import { ObservablePropertySwitcherComponent } from './observable-property-switcher/observable-property-switcher.component';
import {LineChartComponent} from './line-chart/line-chart.component';
import {AirQualityLineChartComponent} from './air-quality-line-chart/air-quality-line-chart.component';
import {WindDirectionLineChartComponent} from './wind-direction-line-chart/wind-direction-line-chart.component';
import {ColumnChartComponent} from './column-chart/column-chart.component';
import {TotalComponent} from './total/total.component';


@NgModule({

  imports: [
    SharedModule,
    PlotRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],

  declarations: [
    PlotComponent,
    ObservationLoadingModalComponent,
    PlatformSwitcherComponent,
    ObservablePropertySwitcherComponent,
    LineChartComponent,
    AirQualityLineChartComponent,
    WindDirectionLineChartComponent,
    ColumnChartComponent,
    TotalComponent
  ],

  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-GB' },
  ],
})

export class PlotModule { }
