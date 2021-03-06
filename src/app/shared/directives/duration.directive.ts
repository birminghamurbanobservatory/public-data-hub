import { Directive, ElementRef, Input, OnInit } from '@angular/core';

import * as moment from 'moment';

@Directive({
  selector: '[duration]'
})
export class DurationDirective implements OnInit {

  @Input() duration: number;

  @Input() aggregation: string;

  private abbrev = {
    average: 'avg',
    maximum: 'max',
    minimum: 'min',
    sum: 'sum',
    count: 'count'
  }

  constructor(
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    this.el.nativeElement.innerHTML = this.durationToString();
  }

  private durationToString() {
    let m = moment.duration(this.duration, 'seconds');
    
    if (this.duration <= 59) {
      return `${this.aggregation} over ${m.seconds()} secs.`;
    }
      
    if (this.duration >= 60 && this.duration <= 3599) {
      return `${m.minutes()} minute ${this.abbrev[this.aggregation]}`
    }

    return `${this.aggregation} over ${m.hours()} hr.`
  }
}