import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { PlatformModalService } from './platform-modal.service';
import { Observation } from 'src/app/observation/observation.class';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, switchMap, tap, mergeMap, concatMap, mergeMapTo } from 'rxjs/operators';
import { ObservationService } from 'src/app/observation/observation.service';
import * as moment from 'moment';
import { SensorService } from 'src/app/sensor/sensor.service';
import { Sensor } from 'src/app/sensor/sensor.class';

@Component({
    selector: 'buo-platform-modal',
    templateUrl: './platform-modal.component.html',
})
export class PlatformModalComponent implements OnInit {

    public showModal: Boolean = false;
    public observation: Observation;
    public sensor: Sensor;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private platformModalService: PlatformModalService,
        private observationService: ObservationService,
        private sensorService: SensorService,
        ) {}

    ngOnInit(): void {
        this.observationService.getObsersvation('628-94-2020-04-29T05:55:57.000Z')
        .pipe(
            // tap(v => console.log(v)),
            mergeMap(
                (obs) => this.sensorService.getSensor(obs.madeBySensor),
                (observation, sensor) => {
                    return { observation, sensor };
                })
            )
        .subscribe((result) => {
            this.observation = result.observation;
            this.sensor = result.sensor;
            this.showModal = true;
            console.log(result);
        });

        this.platformModalService.observation
            .pipe(
                takeUntil(this.destroy$),
                switchMap((id: string) => this.observationService.getObsersvation(id)),
                mergeMap((obs) => this.sensorService.getSensor(obs.madeBySensor))
            )
            .subscribe((result) => {
                console.log(result)
                this.observation = result;
                this.showModal = true;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    @HostListener('document:keyup', ['$event'])
    handleEscKeyPress(event: KeyboardEvent) {
        if (event.keyCode !== 27) return;
     
        event.stopImmediatePropagation();
          
        this.showModal = false;
    }

    resultTime(time) {
        return moment(time).format('Do MMMM YYYY, HH:mm:ss')
    }
}