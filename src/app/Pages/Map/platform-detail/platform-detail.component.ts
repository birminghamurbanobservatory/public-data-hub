import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {style, animate, transition, trigger} from '@angular/animations';

import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { PlatformService } from 'src/app/platform/platform.service';
import { ObservationService } from 'src/app/observation/observation.service';
import { ObservationModalService } from 'src/app/Components/ObservationModal/observation-modal.service';

import { Platform } from 'src/app/platform/platform.class';
import { Observation } from 'src/app/observation/observation.class';

@Component({
  selector: 'buo-map-platforms',
  templateUrl: './platform-detail.component.html',
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
export class PlatformDetailComponent implements OnInit {

  public platform$: Observable < Platform >

  public observations$: Observable < Observation[] >

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private platformService: PlatformService,
      private observationService: ObservationService,
      private observationModalService: ObservationModalService,
    ) {}

  ngOnInit(): void {
    // retrieve the platform details
    this.platform$ = this.route.paramMap.pipe(
      switchMap((params: Params) => this.platformService.getPlatform(params.get('id')))
    )
    // retrieve the lastest observations for platform  
    this.observations$ = this.route.paramMap.pipe(
      switchMap(
        (params: Params) => this.getLatestObservations(params.get('id'))
        .pipe(
          map(response => response.data),
        )
      )
    )
  }

  /**
   * Closes the side panel displaying deployment info
   * Not strictly necessary but does update url
   * 
   */
  public close(): void {
    this.router.navigate(['/map/platforms']);
  }

  public showModal(obs) {
    this.observationModalService.observationSelected(obs.id);
  }

  public getLatestObservations(platform: string) {

    return this.observationService.getObservations({
      ancestorPlatforms: {
        includes: platform,
      },
      flags: {
        exists: false
      }
    }, {
      onePer: 'timeseries',
      populate: ['observedProperty', 'unit', 'disciplines']
    })
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