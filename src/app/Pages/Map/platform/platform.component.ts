import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';

import * as moment from 'moment';

import { PlatformService } from 'src/app/platform/platform.service';
import { ObservationService } from 'src/app/observation/observation.service';
import { MapMarker } from '../../../Interfaces/map-marker.interface';
import { Observation } from 'src/app/observation/observation.class';
import { ObservationModalService } from 'src/app/Components/ObservationModal/observation-modal.service';

@Component({
    selector: 'buo-map-platforms',
    templateUrl: './platform.component.html',
})
export class PlatformComponent implements OnInit {

    /**
     * Top level platform user has selected to view
     */
    public platform$;

    /**
     * Latest observations for top level platform
     */
    public observations$;

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
          switchMap((params: Params) => this.getLatestObservations(params.get('id')))
      )
    }

    public close(): void {
      this.router.navigate(['/map']);
    }

  public showPlatform(obs) {
      this.observationModalService.observationSelected(obs.id);
  }
        /**
     * Handles the click event when user selects a platform
     * Note: marker.platform is the ID of a platform
     * 
     * @param marker : Google Maps Map Marker
     */
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