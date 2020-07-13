import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {Total} from './total';
import {Observation} from 'src/app/observation/observation.class';
import * as check from 'check-types';
import {last, round, sortBy} from 'lodash';
import {formatDistance} from 'date-fns';

@Component({
    selector: 'buo-total',
    templateUrl: './total.component.html',
})
export class TotalComponent implements OnInit {

    // @Input() timeseries: Timeseries[];
    @Input() timeseries: Subject<any>;

    public totals: Total[];
    public symbol: string;

    constructor(

    ) {}

    ngOnInit(): void {

        this.timeseries.subscribe(d => {

            this.totals = d.tso
            .filter((ts) => {
                return check.nonEmptyArray(ts.observations);
            })
            .map((ts) => {
                const total = this.observationsToTotal(ts.observations);
                total.colour = ts.colours.point;
                return total;
            })

            this.symbol = d.symbol || '';

        })

    }


    private observationsToTotal(observations: Observation[]): Total {

        const sortedObs = sortBy(observations, 'resultTime');

        const start = new Date(sortedObs[0].phenomenonTime.hasBeginning);
        const end = new Date(last(sortedObs).phenomenonTime.hasEnd);

        const output = sortedObs.reduce(({msMissing, sum, previousEnd}, observation) => {

            let gap;
            if (previousEnd === null) {
                gap = 0;
            } else {
                const diff = new Date(observation.phenomenonTime.hasBeginning).getTime() - new Date(previousEnd).getTime();
                gap = Math.max(diff, 0); // just in case there's some overlap.
            }

            return {
                msMissing: msMissing + gap,
                sum: sum + observation.hasResult.value,
                previousEnd: observation.phenomenonTime.hasEnd
            }

        }, {msMissing: 0, sum: 0, previousEnd: null});

        return {
            value: round(output.sum, 2),
            start,
            end,
            percentMissing: round((output.msMissing / (end.getTime() - start.getTime())) * 100),
            timeFrameText: formatDistance(start, end)
        }

    }

}

