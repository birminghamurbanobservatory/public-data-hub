import { Component, Input, OnInit } from '@angular/core';
import { Sensor } from 'src/app/sensor/sensor.class';
import { Platform } from 'src/app/platform/platform.class';

@Component({
    selector: 'buo-sensor-card',
    template: `
    <div *ngIf="sensors.length">
        <p>Sensors</p>

        <div *ngFor="let sensor of sensors">
            <h2>{{ sensor.name }}</h2>
            <p>{{ sensor.description }}</p>
            <p>In deployment {{ sensor.ownerDeployment }}</p>
        </div>

    </div>`
})

export class SensorCardComponent implements OnInit {

    /**
     * Notionally always a child platform
     *
     */
    @Input() platform: Platform;

    /**
     * Array of sensors hosted on platform
     *
     */
    public sensors: Sensor[];

    ngOnInit(): void {
        // as hosts[] may be platform or sensor, filter for sensors
        this.sensors = this.platform.hosts.filter((item: Platform | Sensor) => item['@type'] === 'Sensor');
    }

}
