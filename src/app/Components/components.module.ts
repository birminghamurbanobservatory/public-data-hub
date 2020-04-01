import { NgModule } from '@angular/core';

import { PlatformInformationPanelComponent } from './PlatformInformationPanel/platform-information-panel.component';
import { CommonModule } from '@angular/common';
import { SensorCardComponent } from './SensorCard/sensor-card.component';

@NgModule({

    imports: [
        CommonModule,
    ],

    declarations: [
        PlatformInformationPanelComponent,
        SensorCardComponent,
    ],

    exports: [
        PlatformInformationPanelComponent,
        SensorCardComponent,
    ]

})

export class ComponentsModule { }