import { NgModule } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DatetimeDirective } from './directives/datetime.directive';
import { DurationDirective } from './directives/duration.directive';
import {ObservationModalComponent} from './observation-model/observation-modal.component';
import {RouterModule} from '@angular/router';
import {GoogleMapComponent} from './google-maps/google-maps.component';
import {LinkifyPipe} from './pipes/linkify.pipe';
import { TooltipModule } from 'ng2-tooltip-directive';
import { TooltipOptions } from 'ng2-tooltip-directive';
 
// Set some detaults for the tooltip
const MyDefaultTooltipOptions: TooltipOptions = {
  theme: 'light'
};


@NgModule({

  imports: [
    // These are modules that the component(s) in the declarations array need
    CommonModule,
    RouterModule,
    TooltipModule.forRoot(MyDefaultTooltipOptions as TooltipOptions)
  ],

  declarations: [
    DatetimeDirective,
    DurationDirective,
    ObservationModalComponent, // this is used in more than 1 feature modules, hence loading here.
    GoogleMapComponent,
    LinkifyPipe
  ],

  exports: [
    CommonModule,
    ReactiveFormsModule,
    DatetimeDirective,
    DurationDirective,
    ObservationModalComponent,
    GoogleMapComponent,
    LinkifyPipe,
    TooltipModule
  ]

})
export class SharedModule {}
