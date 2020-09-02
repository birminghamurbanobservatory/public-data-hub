import { Component, OnInit } from '@angular/core';
import {style, animate, transition, trigger} from '@angular/animations';
import { Observable } from 'rxjs';
import { filter, delay, tap } from 'rxjs/operators';

import {Platform} from 'src/app/shared/models/platform.model';
import {Deployment} from 'src/app/shared/models/deployment.model';
import {Observation} from 'src/app/shared/models/observation.model';
import {windDirectionDegreeToText} from 'src/app/shared/utils/weather-funcs';
import {ObservationModalService} from 'src/app/shared/observation-model/observation-modal.service';
import {PlatformDetailModalService} from './platform-detail-modal.service';



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
        animate('400ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ]
  
})
export class PlatformDetailModalComponent implements OnInit {

  public showModal$: Observable<Boolean>;
  public platform$: Observable <Platform>;
  public deployment$: Observable<Deployment>;
  public observations$: Observable <Observation[]>
  public windDirectionDegreeToText = windDirectionDegreeToText;

  constructor(
    private observationModalService: ObservationModalService,
    private detailModalService: PlatformDetailModalService,
  ) {}

  ngOnInit(): void {
    this.showModal$ = this.detailModalService.showModal$;

    this.detailModalService.showModal$.pipe(
      filter(show => show === true),
      delay(2000),
      ).subscribe(() => {
        this.observations$ = this.detailModalService.observations;
        this.platform$ = this.detailModalService.platformDetail
        .pipe(
          tap((platform) => {
            if (platform.inDeployment) {
              this.deployment$ = this.detailModalService.deployment(platform)
            }
          })
        )
      });
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

  public isOld(resultTime: Date): boolean { 
    const hours = 1;
    return new Date(resultTime).getTime() < (Date.now() - 1000 * 60 * 60 * hours) ;
  }

}