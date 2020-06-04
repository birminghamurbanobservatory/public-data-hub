import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from 'src/app/Components/components.module';

import { ObservedPropertyComponent } from './observed-property.component';
import { ObservedPropertyRoutingModule } from './observed-property-routing.module';
import { DirectivesModule } from 'src/app/Directives/directives.module';
import { DatetimeFilterComponent } from './datetime-filter/datetime-filter.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({

    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        ReactiveFormsModule,
        ObservedPropertyRoutingModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
    ],

    declarations: [
        ObservedPropertyComponent,
        DatetimeFilterComponent,
    ],

})

export class ObservedPropertyModule { }
