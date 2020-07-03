import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {style, animate, transition, trigger} from '@angular/animations';

import { Observable } from 'rxjs';
import { switchMap, map, tap, filter } from 'rxjs/operators';
import {sortBy} from 'lodash';

import { ObservationModalService } from 'src/app/Components/ObservationModal/observation-modal.service';

import { Platform } from 'src/app/platform/platform.class';
import { Observation } from 'src/app/observation/observation.class';
import {Deployment} from 'src/app/Interfaces/deployment.interface';
import {DeploymentService} from 'src/app/Services/deployment/deployment.service';
import { PlatformDetailModalService } from './platform-detail-modal.service';

@Component({
  selector: 'buo-platform-detail-modal',
  templateUrl: './platform-detail-modal.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('400ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        style({transform: 'translatex(0%)'}),
        animate('400ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
  
})
export class PlatformDetailModalComponent implements OnInit {

  public showModal$: Observable<Boolean>;
  public platform$: Observable <Platform>;
  public deployment$: Observable<Deployment>;

  public observations$: Observable < Observation[] >

    constructor(
      private observationModalService: ObservationModalService,
      private detailModalService: PlatformDetailModalService,
    ) {}

  ngOnInit(): void {
    this.showModal$ = this.detailModalService.showModal$;

    this.detailModalService.showModal$.pipe(
      filter(show => show === true),
      ).subscribe(() => {
        this.observations$ = this.detailModalService.observations;
        this.platform$ = this.detailModalService.platformDetail;
        this.platform$.subscribe(platform => {
          if (platform.inDeployment) {
            this.deployment$ = this.detailModalService.deployment(platform)
          }
        });
      })
  }

  /**
   * Closes the side panel displaying deployment info
   * Not strictly necessary but does update url
   */
  public close(): void {
    this.detailModalService.closeModal();
  }

  public showObservationModal(obs) {
    this.observationModalService.observationSelected(obs.id);
  }

  /**
   * Converts the wind direction to text representation
   * @param degree 
   */
  public windDirectionDegreeToText(degree) {
    const val = Math.floor((degree / 45) + 0.5);
    const arr = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return arr[(val % 8)];
  }
}