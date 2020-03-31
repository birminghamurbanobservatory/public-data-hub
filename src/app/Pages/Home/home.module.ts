import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleMapsModule } from '@angular/google-maps';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({

    imports: [
        CommonModule,
        GoogleMapsModule,
        HomeRoutingModule,
    ],

    declarations: [
        HomeComponent
    ],

})

export class HomeModule { }
