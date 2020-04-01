import { NgModule } from '@angular/core';

import { GoogleMapsModule } from '@angular/google-maps';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ComponentsModule } from 'src/app/Components/components.module';
import { PlatformInformationPanelComponent } from 'src/app/Components/PlatformInformationPanel/platform-information-panel.component';
import { CommonModule } from '@angular/common';

@NgModule({

    imports: [
        CommonModule,
        ComponentsModule,
        GoogleMapsModule,
        HomeRoutingModule,
    ],

    declarations: [
        HomeComponent,
    ],

})

export class HomeModule { }
