import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { PlatformService } from 'src/app/platform/platform.service';
import { of, forkJoin } from 'rxjs';
import { SensorService } from 'src/app/sensor/sensor.service';
import { Sensor } from 'src/app/sensor/sensor.class';
import { Platform } from 'src/app/platform/platform.class';
import { ObservationService } from 'src/app/observation/observation.service';

import * as moment from 'moment';

@Component({
    selector: 'buo-platform-detail',
    templateUrl: './platform-detail.component.html'
})
export class PlatformDetailComponent implements OnInit {

    public platform: Platform;
    public sensors: Sensor[];

    constructor(
        private route: ActivatedRoute,
        private platformService: PlatformService,
        private sensorService: SensorService,
        private observationService: ObservationService,
    ) { }

    ngOnInit() {
        this.route.paramMap
            .pipe(
                // tap((params: ParamMap) => console.log(params.get('id'))),
                switchMap((params: ParamMap) => forkJoin({
                    platform: this.platformService.getPlatform(params.get('id'))
                        .pipe(catchError(error => of(error))),
                    sensors: this.sensorService.getSensors({ isHostedBy: params.get('id') })
                        .pipe(catchError(error => of(error))),
                    lastReadings: this.observationService.getObservations({
                        ancestorPlatforms: {
                            includes: params.get('id'),
                        }
                    }, {
                        onePer: 'timeseries'
                    })
                })),
                // this is a bit clunky, is there a better way...?!
                map(obs => {
                    obs.sensors.map(sensor => {
                        obs.lastReadings.data.forEach((reading) => {
                            if (sensor.id === reading.madeBySensor) {
                                sensor.lastReading = reading;
                            }
                        });

                        return sensor;
                    });

                    return obs;
                })
            )
            .subscribe((response) => {
                this.platform = response.platform;
                this.sensors = response.sensors;
                console.log(response.sensors)
            });
    }

    public formatDate(date) {
        return moment(date).format('DD/MM/YY');
    }

    public formatTime(date) {
        return moment(date).format('HH:mm');
    }
}
