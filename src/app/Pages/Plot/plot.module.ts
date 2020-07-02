import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '../../Components/components.module';

import { PlotComponent } from './plot.component';
import { PlotRoutingModule } from './plot-routing.module';
import { DirectivesModule } from '../../Directives/directives.module';
import { DatetimeFilterComponent } from './datetime-filter/datetime-filter.component';
import { ObservationLoadingModalComponent } from './loading-modal/loading-modal.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';

@NgModule({

    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        ReactiveFormsModule,
        PlotRoutingModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
    ],

    declarations: [
        PlotComponent,
        DatetimeFilterComponent,
        ObservationLoadingModalComponent,
    ],

    providers: [
        { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-GB' },
    ],
})

export class PlotModule { }
