import { Component, HostListener, OnInit } from '@angular/core';
import { ObservationModalService } from './observation-modal.service';
import { Observation } from 'src/app/observation/observation.class';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'buo-observation-modal',
    templateUrl: './observation-modal.component.html',
})
export class ObservationModalComponent implements OnInit {

    public showModal: Boolean = false;
    public observation: Observation;
    public timeseries;
    public firstObservation: Observation;
    public deployment$;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private observationModalService: ObservationModalService,
        ) {}

    ngOnInit(): void {

        this.observationModalService.observationInfo()
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.observation = result.observation;
                this.firstObservation = result.earliest;
                this.timeseries = result.timeseries;
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