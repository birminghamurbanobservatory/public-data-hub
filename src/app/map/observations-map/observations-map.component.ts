import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap, filter, tap, map, takeUntil } from 'rxjs/operators';
import { Subscription, Observable, Subject } from 'rxjs';

import {MapPinService} from 'src/app/shared/google-maps/map-pin.service';
import {GoogleMapService} from 'src/app/shared/google-maps/google-map.service';
import {MapMarker} from 'src/app/shared/google-maps/map-marker.model';
import {ObservationsMapService} from './observations-map.service';
import {ObservationModalService} from 'src/app/shared/observation-model/observation-modal.service';
import {uniq} from 'lodash';
import {Deployment} from 'src/app/shared/models/deployment.model';
import {DeploymentService} from 'src/app/shared/services/deployment.service';
import {Observation} from 'src/app/shared/models/observation.model';


@Component({
  selector: 'buo-observations-map',
  templateUrl: './observations-map.component.html', // has no template as output onto map
})
export class ObservationsMapComponent implements OnInit, OnDestroy, AfterViewInit {

  private mapSubscription: Subscription;
  public deployments: any[] = [];
  public observations: Observation[] = [];
  private unsubscribe$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private pins: MapPinService,
    private map: GoogleMapService,
    private observationsMapService: ObservationsMapService,
    private modal: ObservationModalService,
    private deploymentService: DeploymentService
  ) {}

  ngOnInit(): void {
    
    this.mapSubscription = this.map.selectedMarker
      .pipe(
        filter((value: MapMarker) => value.type === 'observation'),
      )
      .subscribe((marker: MapMarker) => this.modal.observationSelected(marker.id));

  }

  ngAfterViewInit(): void {
    this.route.queryParams.pipe(
      takeUntil(this.unsubscribe$),
      switchMap((params: Params) => this.observationsMapService.getObservations(params)),
      map((response) => response.data),
    )
    .subscribe((observations) => {

      this.observations = observations;
      this.addMarkers(observations)

      if (observations.length) {

        // Pull out the unique deployment IDs
        const deploymentIds = uniq(observations.map((obs) => obs.hasDeployment).filter((id) => id !== undefined));
        // Get details about these deployments
        this.deploymentService.getDeployments({id: {in: deploymentIds}}).pipe(
          takeUntil(this.unsubscribe$),
          map((deployments: any[]) => {
            return deployments.map((deployment) => {
              deployment.selected = true;
              return deployment
            })
          })
        ).subscribe((deployments) => {
          this.deployments = deployments;
        })

      } else {
        this.deployments = [];
      }

    });
  }

  
  private addMarkers(data) {
    const markers: MapMarker[] = data.map((obs) => this.pins.observationPin(obs));
    this.map.spiderfierMarkers(markers);
  }


  public toggleDeployment(deployment) {
    console.log(`Toggling ${deployment.label}`);
    deployment.selected = !deployment.selected;
    const selectedDeploymentIds = this.deployments.filter((d) => d.selected).map((d) => d.id)
    console.log(selectedDeploymentIds);
    const filteredObs = this.observations.filter((obs) => selectedDeploymentIds.includes(obs.hasDeployment));
    this.addMarkers(filteredObs);
  }



  ngOnDestroy(): void {
    this.mapSubscription.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}