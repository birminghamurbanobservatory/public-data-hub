import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservationRoutingModule } from './observation-routing.module';
import { ObservationComponent } from './observation.component';
import { DirectivesModule } from 'src/app/Directives/directives.module';

@NgModule({
    imports: [
        CommonModule,
        DirectivesModule,
        ObservationRoutingModule,
    ],
    declarations: [
        ObservationComponent,
    ]
})
export class ObservationModule {}