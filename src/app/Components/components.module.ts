import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { GoogleMapsModule } from '@angular/google-maps';

import { GoogleMapComponent } from './GoogleMap/google-map.component';
import { TimeSeriesGraphComponent } from './TimeSeriesGraph/time-series-graph.component';
import { ObservationModalComponent } from './ObservationModal/observation-modal.component';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({

    imports: [
        CommonModule,
        RouterModule,
        GoogleMapsModule,
        TooltipModule,
    ],

    declarations: [
        GoogleMapComponent,
        ObservationModalComponent,
        TimeSeriesGraphComponent,
    ],

    exports: [
        GoogleMapComponent,
        ObservationModalComponent,
        TimeSeriesGraphComponent,
    ]

})
export class ComponentsModule { }
