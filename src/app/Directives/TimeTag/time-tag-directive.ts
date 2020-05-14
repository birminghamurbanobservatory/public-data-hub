import { Component, Input } from '@angular/core';

import * as moment from 'moment';

@Component({
    selector: 'buo-time-tag',
    template: `<time>{{ displayTime }}</time>`
})
export class TimeTagComponent {

    @Input() datetime: string;

    @Input() format: string;

    get displayTime() {
        return moment(this.datetime).format(this.format);
    }

}