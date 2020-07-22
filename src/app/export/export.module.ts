import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ExportRoutingModule } from './export-routing.module';
import { TimeseriesExportComponent } from './timeseries-export/timeseries-export.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';


@NgModule({

  imports: [
    SharedModule,
    ExportRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],

  declarations: [
    TimeseriesExportComponent
  ],

  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-GB' },
  ]

})
export class ExportModule { }
