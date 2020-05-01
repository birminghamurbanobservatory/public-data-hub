import { Component, HostListener, OnInit } from '@angular/core';
import { PlatformModalService } from './platform-modal.service';
import { Observation } from 'src/app/observation/observation.class';
import { Subject, forkJoin, concat, of, from } from 'rxjs';
import { takeUntil, switchMap, tap, mergeMap, map, flatMap, concatMap, toArray} from 'rxjs/operators';
import { ObservationService } from 'src/app/observation/observation.service';
import { SensorService } from 'src/app/sensor/sensor.service';
import * as moment from 'moment';
import { Sensor } from 'src/app/sensor/sensor.class';
import { PlatformService } from 'src/app/platform/platform.service';

@Component({
    selector: 'buo-platform-modal',
    templateUrl: './platform-modal.component.html',
})
export class PlatformModalComponent implements OnInit {

    public showModal: Boolean = false;
    public observation: Observation;
    public sensor: Sensor;
    public firstObservation: Observation;
    public deployment$;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private platformModalService: PlatformModalService,
        private observationService: ObservationService,
        private sensorService: SensorService,
        private platformService: PlatformService,
        ) {}

    ngOnInit(): void {

        // can delete query as only for UI
        this.observationService.getObservation('amPqZwaVDHX6sN')
        .pipe(
            mergeMap(
                (obs: Observation) => forkJoin({
                    sensor: this.sensorService.getSensor(obs.madeBySensor),
                    earliest: this.observationService.getFirstObservation(obs.observedProperty["@id"], obs.ancestorPlatforms[0]),
                }), (observation, forkJoin) => {
                    return { observation, ...forkJoin }
                })
            )

        this.platformModalService.observationInfo()
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.observation = result.observation;
                this.firstObservation = result.earliest;
                this.sensor = result.sensor;

                
                this.deployment$ = from(this.observation.ancestorPlatforms)
                .pipe(
                    concatMap(id => this.platformService.getPlatform(id)),
                    toArray(),
                );

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