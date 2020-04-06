import { NgModule } from '@angular/core';


import { PlatformDetailComponent } from './platform-detail.component';
import { PlatformDetailRoutingModule } from './platform-detail-routing.module';
import { ComponentsModule } from 'src/app/Components/components.module';
import { CommonModule } from '@angular/common';

@NgModule({

    imports: [
        CommonModule,
        ComponentsModule,
        PlatformDetailRoutingModule
    ],

    declarations: [
        PlatformDetailComponent,
    ],

})

export class PlatformDetailModule { }
