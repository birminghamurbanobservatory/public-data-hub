import { NgModule } from '@angular/core';
import { TimeTagComponent } from './TimeTag/time-tag-directive';

@NgModule({

    declarations: [
        TimeTagComponent,
    ],

    exports: [
        TimeTagComponent,
    ]

})
export class DirectivesModule {}
