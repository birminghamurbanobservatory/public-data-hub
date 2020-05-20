import { Directive, Input, ElementRef, OnInit } from '@angular/core';

import * as moment from 'moment';

@Directive({
    selector: '[datetime]',
})
export class DatetimeDirective implements OnInit {

    @Input() datetime: string;

    @Input() format: string;

    constructor(
        private el: ElementRef,
    ) {}


    ngOnInit(): void {
        this.el.nativeElement.innerHTML = this.formatDateTime();
    }

    private formatDateTime() {
        if (this.format === 'from') {
            return moment(this.datetime).fromNow();
        }

        return moment(this.datetime).format(this.format);
    }

}