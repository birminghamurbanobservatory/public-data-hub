import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GoogleMapsModule } from '@angular/google-maps';

import { ControlPanelComponent } from './ControlPanel/control-panel.component';
import { GoogleMapComponent } from './GoogleMap/google-map.component';
import { PlatformInformationPanelComponent } from './PlatformInformationPanel/platform-information-panel.component';
import { SensorCardComponent } from './SensorCard/sensor-card.component';

@NgModule({

    imports: [
        CommonModule,
        RouterModule,
        GoogleMapsModule,
    ],

    declarations: [
        ControlPanelComponent,
        GoogleMapComponent,
        PlatformInformationPanelComponent,
        SensorCardComponent,
    ],

    exports: [
        ControlPanelComponent,
        GoogleMapComponent,
        PlatformInformationPanelComponent,
        SensorCardComponent,
    ]

})

export class ComponentsModule { }
