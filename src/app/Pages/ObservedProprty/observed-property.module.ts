import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/Components/components.module';

import { ObservedPropertyComponent } from './observed-property.component';
import { ObservedPropertyRoutingModule } from './observed-property-routing.module';

@NgModule({

    imports: [
        CommonModule,
        ComponentsModule,
        ObservedPropertyRoutingModule,
    ],

    declarations: [
        ObservedPropertyComponent,
    ],

})

export class ObservedPropertyModule { }
