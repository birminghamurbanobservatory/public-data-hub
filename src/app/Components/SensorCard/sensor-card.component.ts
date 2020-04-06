import { Component, Input, OnInit } from '@angular/core';
import { SensorService } from 'src/app/sensor/sensor.service';
import { Observable } from 'rxjs';
import { Sensor } from 'src/app/sensor/sensor.class';
import { map, tap } from 'rxjs/operators';

@Component({
    selector: 'buo-sensor-card',
    template: `
    <div>
        <p>Sensors</p>
        <div *ngFor="let sensor of sensors$ | async">
            <h2>{{ sensor.name }}</h2>
            <p>{{ sensor.description }}</p>
            <p>In deployment {{ sensor.ownerDeployment }}</p>
        </div>
    </div>`
})

export class SensorCardComponent implements OnInit {

    @Input() platform;

    public sensors$: Observable<Sensor[]>;

    constructor(private sensorService: SensorService) { }

    ngOnInit(): void {
        this.sensors$ = this.sensorService.getSensors({ isHostedBy: this.platform.id })
            .pipe(
                tap(val => console.log(val))
            );
    }
}