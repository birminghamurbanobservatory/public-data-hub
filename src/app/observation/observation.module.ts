import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ObservationRoutingModule } from './observation-routing.module';
import { ObservationComponent } from './observation.component';


@NgModule({
  imports: [
    SharedModule,
    ObservationRoutingModule,
  ],
  declarations: [
    ObservationComponent,
  ]
})
export class ObservationModule {}