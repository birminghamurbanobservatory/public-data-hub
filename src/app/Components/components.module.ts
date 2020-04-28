import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GoogleMapsModule } from '@angular/google-maps';

import { ControlPanelComponent } from './ControlPanel/control-panel.component';
import { GoogleMapComponent } from './GoogleMap/google-map.component';
import { DeploymentPanelComponent } from './DeploymentPanel/deployment-panel.component';
import { TimeSeriesGraphComponent } from './TimeSeriesGraph/time-series-graph.component';
import { PlatformModalComponent } from './PlatformModal/platform-modal.component';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({

    imports: [
        CommonModule,
        RouterModule,
        GoogleMapsModule,
        TooltipModule,
    ],

    declarations: [
        ControlPanelComponent,
        DeploymentPanelComponent,
        GoogleMapComponent,
        PlatformModalComponent,
        TimeSeriesGraphComponent,
    ],

    exports: [
        ControlPanelComponent,
        DeploymentPanelComponent,
        GoogleMapComponent,
        PlatformModalComponent,
        TimeSeriesGraphComponent,
    ]

})
export class ComponentsModule { }
