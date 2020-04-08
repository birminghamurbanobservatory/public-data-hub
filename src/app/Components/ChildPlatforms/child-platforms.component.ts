import { Component, Input, OnInit } from '@angular/core';
import { Platform } from 'src/app/platform/platform.class';
import { Sensor } from 'src/app/sensor/sensor.class';

@Component({
    selector: 'buo-child-platforms',
    templateUrl: './child-platforms.component.html'
})
export class ChildPlatformsComponent implements OnInit {

    @Input() hosts: [];

    public platforms: Platform[] = [];

    ngOnInit(): void {

        this.platforms = this.hosts.filter((item: Platform | Sensor) => item['@type'] === 'Platform');

    }
}