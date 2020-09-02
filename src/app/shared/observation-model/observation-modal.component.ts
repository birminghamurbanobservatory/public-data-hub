import { Component, HostListener, OnInit } from '@angular/core';
import {style, animate, transition, trigger} from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil, tap, switchMap, delay } from 'rxjs/operators';

import { ObservationModalService } from './observation-modal.service';
import {Observation} from '../models/observation.model';


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
  public observation: Observation | null;
  // public timeseries;
  // public firstObservation: Observation;
  // public deployment$;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private observationModalService: ObservationModalService,
    ) {}

  ngOnInit(): void {

    this.observationModalService.observation
    .pipe(
      tap(() => this.showModal = true),
      tap(() => this.observation = null),
      delay(2000),
      takeUntil(this.destroy$),
      switchMap((id: string) => this.observationModalService.observationInfo(id))
    )
    .subscribe((obs) => this.observation = obs);
    
    // this.observationModalService.observationInfo()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((observation) => {
    //     console.log(observation);
    //     this.observation = observation;
    //     this.showModal = true;
    //   });

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

}