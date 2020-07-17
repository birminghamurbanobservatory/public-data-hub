import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {sortBy} from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';

import {PlatformService} from 'src/app/shared/services/platform.service';
import {ObservationService} from 'src/app/shared/services/observation.service';
import {DeploymentService} from 'src/app/shared/services/deployment.service';
import {Deployment} from 'src/app/shared/models/deployment.model';


@Injectable()
export class PlatformDetailModalService {

  private platformId: string;
  private showModalSource$: BehaviorSubject<Boolean> = new BehaviorSubject(false);
  public showModal$ = this.showModalSource$.asObservable();
  public deployment$: Observable<Deployment>;

  public display(id: string) {
    this.platformId = id;
    this.showModalSource$.next(true);
  }

  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private platformService: PlatformService,
  private observationService: ObservationService,
  private deploymentService: DeploymentService
  ) {}


  // retrieve the platform details
  public get platformDetail() {
  return this.platformService.getPlatform(this.platformId);
  }   
    

  // retrieve the lastest observations for platform  
  public get observations() {
    return this.getLatestObservations(this.platformId)
    .pipe(
    map(response => response.data),
    map((observations) => {
      return sortBy(observations, ['observedProperty.label', 'aggregation.id'])
    })
    )
  }
  

  // Worth getting the name (label) of the platform's deployment too so we can show this.
  public deployment(platform) {
    return this.deploymentService.getDeployment(platform.inDeployment);
  }


  /**
   * Closes the side panel displaying deployment info
   * Not strictly necessary but does update url
   */
  public closeModal(): void {
    this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { platform: null },
    queryParamsHandling: 'merge',
    });
    this.showModalSource$.next(false);
  }
  

  public getLatestObservations(platform: string) {
  
    return this.observationService.getObservations({
    ancestorPlatforms: {
      includes: platform,
    },
    flags: {
      exists: false
    },
    disciplines: {
      not: ['instrumental'] // don't want the user seeing battery, signal, tilt, etc readings.
    }
    }, {
    onePer: 'timeseries',
    populate: ['observedProperty', 'unit']
    });
   
  }

}