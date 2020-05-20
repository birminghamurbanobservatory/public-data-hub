import { Component, HostListener, OnInit } from '@angular/core';
import {style, animate, transition, trigger} from '@angular/animations';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as moment from 'moment';

import { ObservationModalService } from './observation-modal.service';
import { Observation } from 'src/app/observation/observation.class';

@Component({
    selector: 'buo-observation-modal',
    templateUrl: './observation-modal.component.html',
    animations: [
        trigger(
          'fadeInOut',
          [
            transition(
            ':enter', [
              style({'opacity': 0}),
              animate('300ms', style({'opacity': 1}))
            ]
          ),
          transition(
            ':leave', [
              style({'opacity': 1}),
              animate('300ms', style({'opacity': 0})),
            ]
          )]
        )
      ],
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