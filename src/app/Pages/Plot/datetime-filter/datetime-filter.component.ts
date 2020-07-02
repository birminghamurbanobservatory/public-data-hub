import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import * as moment from 'moment';

@Component({
    selector: 'buo-property-datetime-filter',
    templateUrl: './datetime-filter.component.html'
})
export class DatetimeFilterComponent implements OnInit {

    @Input() initialTimeWindow: {start: Date; end: Date};

    /**
     * Event emitter for start and end dateime window changes
     */
    @Output() timeWindowChange: EventEmitter<{ start: string, end: string}> = new EventEmitter();

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

        if (this.initialTimeWindow && this.initialTimeWindow.start && this.initialTimeWindow.end) {
            console.log('datepicker has received an initial time window');
            this.patchFormValues(this.initialTimeWindow.start.toISOString(), this.initialTimeWindow.end.toISOString());
        } else {
            this.timePeriod(this.defaultPeriod);
        }

        // Note that because this follows the initialisation above, the initial values won't be emitted, currently this is what we want, 
        // but you could always move the following code above the initialisation code if you did want the initial values to be emitted 
        this.form.valueChanges
        .subscribe(({window}) => {
            this.emitDatetimeChange(
                moment(window[0]).toISOString(), 
                moment(window[1]).toISOString()
            );
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
     * Emits changes in the datetimes to the parent container
     * 
     * @param start : time window start ISO datetime
     * @param end : time window end ISO datetime
     */
    private emitDatetimeChange(start: string, end: string): void {
        this.timeWindowChange.emit({ start, end });
    }
}