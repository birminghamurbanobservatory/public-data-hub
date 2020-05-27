import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'ng2-tooltip-directive';

import { MapRoutingModule } from './map-routing.module';
import { ComponentsModule } from 'src/app/Components/components.module';

import { MapComponent } from './map.component';
import { MenuComponent } from './observations-menu/menu.component';
import { PlatformDetailComponent } from './platform-detail/platform-detail.component';
import { ObservedPropertyComponent } from './observed-property/observed-property.component';
import { ObservedPropertyService } from './observed-property/observed-property.service';
import { DirectivesModule } from 'src/app/Directives/directives.module';
import { PlatformsComponent } from './platforms/platforms.component';

@NgModule({

  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    MapRoutingModule,
    TooltipModule,
  ],

  declarations: [
    MapComponent,
    MenuComponent,
    PlatformsComponent,
    PlatformDetailComponent,
    ObservedPropertyComponent,
  ],

  providers: [
    ObservedPropertyService,
  ]

})

export class MapModule {}
