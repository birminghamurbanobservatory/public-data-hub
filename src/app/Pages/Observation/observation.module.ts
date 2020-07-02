import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservationRoutingModule } from './observation-routing.module';
import { ObservationComponent } from './observation.component';
import { DirectivesModule } from 'src/app/Directives/directives.module';
import { ComponentsModule } from 'src/app/Components/components.module';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        ObservationRoutingModule,
    ],
    declarations: [
        ObservationComponent,
    ]
})
export class ObservationModule {}