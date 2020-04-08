import { Component, Input } from '@angular/core';
import { Platform } from 'src/app/platform/platform.class';

@Component({
    selector: 'buo-platform-card',
    templateUrl: './platform-card.component.html'
})
export class PlatformCardComponent {

    @Input() platform: Platform;

}
