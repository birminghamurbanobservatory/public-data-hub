import { Component, OnInit, Input } from '@angular/core';
import { SensorService } from 'src/app/sensor/sensor.service';
import { Platform } from 'src/app/platform/platform.class';

@Component({
    selector: 'buo-platform-information-panel',
    templateUrl: './platform-information-panel.component.html',
})
export class PlatformInformationPanelComponent {

    // the selected platform information
    @Input() platform;

    // child platforms of the selected platform
    @Input() childPlatforms;

}