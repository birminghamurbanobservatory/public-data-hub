import { NgModule } from '@angular/core';
import { DatetimeDirective } from './datetime-directive';
import { DurationDirective } from './duration.directive';

@NgModule({

    declarations: [
        DatetimeDirective,
        DurationDirective,
    ],

    exports: [
        DatetimeDirective,
        DurationDirective,
    ]

})
export class DirectivesModule {}
