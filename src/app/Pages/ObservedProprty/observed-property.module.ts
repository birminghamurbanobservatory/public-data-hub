import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/Components/components.module';

import { ObservedPropertyComponent } from './observed-property.component';
import { ObservedPropertyRoutingModule } from './observed-property-routing.module';
import { DirectivesModule } from 'src/app/Directives/directives.module';

@NgModule({

    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        ObservedPropertyRoutingModule,
    ],

    declarations: [
        ObservedPropertyComponent,
    ],

})

export class ObservedPropertyModule { }
