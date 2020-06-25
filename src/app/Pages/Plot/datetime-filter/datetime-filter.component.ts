import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import * as moment from 'moment';

@Component({
    selector: 'buo-property-datetime-filter',
    templateUrl: './datetime-filter.component.html'
})
export class DatetimeFilterComponent implements OnInit {

    /**
     * Event emitter for start and end dateime window changes
     */
    @Output() timeWindow: EventEmitter<{ start: string, end: string}> = new EventEmitter();

    /**
     * Form for the date time picker
     */
    public form: FormGroup;

    /**
     * Most recent datetime the user can select in the picker
     */
    public maxDate: string = moment().toISOString();

    /**
     * Default number of hours worth of observations to show
     */
    private defaultPeriod: number = 6;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private location: Location,
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            window: ['', [Validators.required]]
        });

        this.form.valueChanges
        .subscribe(({window}) => {
            this.emitDatetimeChange(
                moment(window[0]).toISOString(), 
                moment(window[1]).toISOString()
            );
        });

        this.route.queryParams
        .subscribe((params: Params) => {
            if (params.hasOwnProperty('start') && params.hasOwnProperty('end')) {
                this.patchFormValues(params.start, params.end);
            } else {
                this.timePeriod(this.defaultPeriod);
            }
        });
    }

    /**
     * Handles the click of pre-defined time windows
     * 6, 12 and 24 hour windows
     * 
     * @param hours: number of hours to show
     */
    public timePeriod(hours: number): void {
        const start = moment().subtract(hours, 'hours').toISOString();
        const end = moment().toISOString();
        this.patchFormValues(start, end);
    }

    /**
     * Updates the form time 'window' values, so that the form always displays
     * the same time window as selected by the user or is present in the url
     * 
     * @param start ISO dateime
     * @param end ISO datetime
     */
    private patchFormValues(start: string, end: string) {
        this.form.controls['window'].patchValue([start, end]);
    }
    /**
     * Updates the url so users can copy and use the url string and 
     * emits changes in the datetimes to the parent container
     * 
     * @param start : time window start ISO datetime
     * @param end : time window end ISO datetime
     */
    private emitDatetimeChange(start: string, end: string): void {
        this.location.replaceState(window.location.pathname, `start=${start}&end=${end}`);
        this.timeWindow.emit({ start, end });
    }
}