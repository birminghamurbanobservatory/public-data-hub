import { Component, HostListener, OnInit } from '@angular/core';
import { PlatformModalService } from './platform-modal.service';
import { Observation } from 'src/app/observation/observation.class';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, switchMap, tap, mergeMap, map} from 'rxjs/operators';
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
    public firstObservation: Observation;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private platformModalService: PlatformModalService,
        private observationService: ObservationService,
        private sensorService: SensorService,
        ) {}

    ngOnInit(): void {

        // can delete query as only for UI
        this.observationService.getObsersvation('geXNVmAV9COBSa')
        .pipe(
            mergeMap(
                (obs: Observation) => forkJoin({
                    sensor: this.sensorService.getSensor(obs.madeBySensor),
                    earliest: this.observationService.getFirstObservation(obs.observedProperty["@id"], obs.ancestorPlatforms[0]),
                }), (observation, forkJoin) => {
                    return { observation, ...forkJoin }
                })
            )
        .subscribe((result) => {
            this.observation = result.observation;
            this.firstObservation = result.earliest;
            this.sensor = result.sensor;
            this.showModal = true;
            console.log(result);
        });

        // this is one ugly and complex query! :-/ One to refactor...
        this.platformModalService.observation
            .pipe(
                takeUntil(this.destroy$),
                switchMap((id: string) => this.observationService.getObsersvation(id)),
                mergeMap(
                    (obs: Observation) => forkJoin({
                        sensor: this.sensorService.getSensor(obs.madeBySensor),
                        earliest: this.observationService.getFirstObservation(obs.observedProperty["@id"], obs.ancestorPlatforms[0]),
                    }), (observation, forkJoin) => {
                        return { observation, ...forkJoin }
                    })
            )
            .subscribe((result) => {
                this.observation = result.observation;
                this.sensor = result.sensor;
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

    resultDate(time) {
        return moment(time).format('Do MMMM YYYY')
    }

    resultTime(time) {
        return moment(time).format('HH:mm:ss')
    }
}