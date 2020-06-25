import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '../../Components/components.module';

import { PlotComponent } from './plot.component';
import { PlotRoutingModule } from './plot-routing.module';
import { DirectivesModule } from '../../Directives/directives.module';
import { DatetimeFilterComponent } from './datetime-filter/datetime-filter.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

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
    ],

})

export class PlotModule { }
