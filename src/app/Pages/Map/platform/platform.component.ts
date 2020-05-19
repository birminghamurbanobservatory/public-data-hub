import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { PlatformService } from 'src/app/platform/platform.service';
import { ObservationService } from 'src/app/observation/observation.service';
import { ObservationModalService } from 'src/app/Components/ObservationModal/observation-modal.service';

import { Platform } from 'src/app/platform/platform.class';
import { Observation } from 'src/app/observation/observation.class';

@Component({
  selector: 'buo-map-platforms',
  templateUrl: './platform.component.html',
})
export class PlatformComponent implements OnInit {

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

    this.platform$ = this.route.paramMap.pipe(
      switchMap((params: Params) => this.platformService.getPlatform(params.get('id')))
    )

    this.observations$ = this.route.paramMap.pipe(
      switchMap(
        (params: Params) => this.getLatestObservations(params.get('id'))
        .pipe(map(response => response.data))
      )
    )
  }

  public close(): void {
    this.router.navigate(['/map']);
  }

  public showPlatform(obs) {
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
}