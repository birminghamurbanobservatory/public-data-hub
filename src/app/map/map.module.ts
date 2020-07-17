import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TooltipModule } from 'ng2-tooltip-directive';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';
import { MapMenuComponent } from './map-menu/map-menu.component';
import { PlatformDetailModalComponent } from './platform-detail-modal/platform-detail-modal.component';
import { ObservationsMapComponent } from './observations-map/observations-map.component';
import { ObservationsMapService } from './observations-map/observations-map.service';
import { PlatformsMapComponent } from './platforms-map/platforms-map';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';
import { PlatformDetailModalService } from './platform-detail-modal/platform-detail-modal.service';

@NgModule({

  imports: [
    SharedModule,
    MapRoutingModule,
    TooltipModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],

  declarations: [
    MapComponent,
    MapMenuComponent,
    PlatformsMapComponent,
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
