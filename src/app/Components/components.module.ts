import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GoogleMapsModule } from '@angular/google-maps';

import { ControlPanelComponent } from './ControlPanel/control-panel.component';
import { GoogleMapComponent } from './GoogleMap/google-map.component';
import { DeploymentPanelComponent } from './DeploymentPanel/deployment-panel.component';
import { SensorCardComponent } from './SensorCard/sensor-card.component';
import { TimeSeriesGraphComponent } from './TimeSeriesGraph/time-series-graph.component';
import { PlatformCardComponent } from './PlatformCard/platform-card.component';
import { ChildPlatformsComponent } from './ChildPlatforms/child-platforms.component';

@NgModule({

    imports: [
        CommonModule,
        RouterModule,
        GoogleMapsModule,
    ],

    declarations: [
        ChildPlatformsComponent,
        ControlPanelComponent,
        DeploymentPanelComponent,
        GoogleMapComponent,
        PlatformCardComponent,
        SensorCardComponent,
        TimeSeriesGraphComponent,
    ],

    exports: [
        ChildPlatformsComponent,
        ControlPanelComponent,
        DeploymentPanelComponent,
        GoogleMapComponent,
        PlatformCardComponent,
        SensorCardComponent,
        TimeSeriesGraphComponent,
    ]

})
export class ComponentsModule { }
