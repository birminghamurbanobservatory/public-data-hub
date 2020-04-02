import { NgModule } from '@angular/core';


import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ComponentsModule } from 'src/app/Components/components.module';
import { CommonModule } from '@angular/common';

@NgModule({

    imports: [
        CommonModule,
        ComponentsModule,
        HomeRoutingModule,
    ],

    declarations: [
        HomeComponent,
    ],

})

export class HomeModule { }
