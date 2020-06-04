import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GoogleMapComponent } from './GoogleMap/google-map.component';
import { LineGraphComponent } from './LineGraph/line-graph.component';
import { ObservationModalComponent } from './ObservationModal/observation-modal.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { DirectivesModule } from '../Directives/directives.module';

@NgModule({

    imports: [
        CommonModule,
        DirectivesModule,
        RouterModule,
        TooltipModule,
    ],

    declarations: [
        GoogleMapComponent,
        ObservationModalComponent,
        LineGraphComponent,
    ],

    exports: [
        GoogleMapComponent,
        ObservationModalComponent,
        LineGraphComponent,
    ]

})
export class ComponentsModule { }
