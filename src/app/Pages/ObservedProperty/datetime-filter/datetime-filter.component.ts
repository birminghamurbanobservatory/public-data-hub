import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { filter, tap, startWith, defaultIfEmpty, isEmpty, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'buo-property-datetime-filter',
    templateUrl: './datetime-filter.component.html'
})
export class DatetimeFilterComponent implements OnInit {

    @Output() window: EventEmitter<Object> = new EventEmitter();
    public form: FormGroup;
    public maxDate = moment().toISOString();

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {

        this.form = this.fb.group({
            window: ['', [Validators.required]]
        });

        this.route.queryParams
        .subscribe((params: Params) => {
            if (params.hasOwnProperty('start') && params.hasOwnProperty('end')) {
                this.window.emit({ 
                    start: params.start, 
                    end: params.end
                });

                this.form.controls['window'].patchValue([params.start, params.end])

            } else {
                this.timePeriod(6);
            }
        });

        this.form.valueChanges
        .subscribe(({window}) => {
            this.setDatetimeWindow({ 
                start: moment(window[0]).toISOString(), 
                end: moment(window[1]).toISOString()
            });
        });
    }

    public timePeriod(time: number) {

        this.setDatetimeWindow({
            start: moment().subtract(time, 'hours').toISOString(),
            end: moment().toISOString()
        });

    }

    private setDatetimeWindow({ start, end }) {
        this.router.navigate([], { queryParams: { start, end }, relativeTo: this.route, queryParamsHandling: 'merge' })
    }
}