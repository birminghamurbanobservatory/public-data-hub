import { Component, OnInit, Input } from '@angular/core';
import { SensorService } from 'src/app/sensor/sensor.service';
import { Platform } from 'src/app/platform/platform.class';

@Component({
    selector: 'buo-deployment-panel',
    templateUrl: './deployment-panel.component.html',
})
export class DeploymentPanelComponent {

    // the selected platform information
    @Input() platform;

}