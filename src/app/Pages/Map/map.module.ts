import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from 'ng2-tooltip-directive';

import { MapRoutingModule } from './map-routing.module';
import { ComponentsModule } from 'src/app/Components/components.module';

import { MapComponent } from './map.component';
import { MapMenuComponent } from './map-menu/map-menu.component';
import { PlatformDetailModalComponent } from './platform-detail-modal/platform-detail-modal.component';
import { ObservationsMapComponent } from './observations-map/observations-map.component';
import { ObservationsMapService } from './observations-map/observations-map.service';
import { DirectivesModule } from 'src/app/Directives/directives.module';
import { PlatformsComponent } from './platforms/platforms.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';
import { PlatformDetailModalService } from './platform-detail-modal/platform-detail-modal.service';

@NgModule({

  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    ReactiveFormsModule,
    MapRoutingModule,
    TooltipModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],

  declarations: [
    MapComponent,
    MapMenuComponent,
    PlatformsComponent,
    PlatformDetailModalComponent,
    ObservationsMapComponent,
  ],

  providers: [
    ObservationsMapService,
    PlatformDetailModalService,
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-GB' },
  ]

})

export class MapModule {}
