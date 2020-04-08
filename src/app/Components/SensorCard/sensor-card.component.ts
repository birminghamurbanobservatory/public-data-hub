import { Component, Input, OnInit } from '@angular/core';
import { Sensor } from 'src/app/sensor/sensor.class';
import { Platform } from 'src/app/platform/platform.class';

@Component({
    selector: 'buo-sensor-card',
    template: `
    <div class="px-4 py-5" *ngIf="sensors.length">
        <dl class="grid grid-cols-1 col-gap-4 row-gap-4">

            <div *ngFor="let sensor of sensors">
                <dt class="text-sm leading-5 font-medium text-gray-500">
                    Sensor
                </dt>
                <dd class="mt-1 text-sm leading-5 text-gray-900">
                    {{ sensor.name }}
                </dd>
            </div>

        </dl>
    </div>

    <!--<div>
        <div>
            <h2>{{ sensor.name }}</h2>
            <i [ngClass]="iconSwitcher(sensor.currentConfig[0].observedProperty)"></i>
            <p>{{ sensor.description }}</p>
            <p>In deployment {{ sensor.ownerDeployment }}</p>
        </div>

    </div>-->`
})

export class SensorCardComponent implements OnInit {

    /**
     * Notionally always a child platform
     *
     */
    @Input() hosts: []; // does not like Platform[] | Sensor[]

    /**
     * Array of sensors hosted on platform
     *
     */
    public sensors: Sensor[] = [];

    ngOnInit(): void {
        // as hosts[] may be platform or sensor, filter for sensors
        if (this.hosts.length) {
            this.sensors = this.hosts.filter((item: Platform | Sensor) => item['@type'] === 'Sensor');
        }
    }

    iconSwitcher(property: string) {

        switch (property) {
            case 'AirTemperature':
                return 'fas fa-thermometer-quarter';

            default:
                return 'fas fa-question';
        }
    }

}
