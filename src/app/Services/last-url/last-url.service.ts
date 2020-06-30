import { Injectable, OnDestroy } from '@angular/core';
import { RoutesRecognized, Router } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class LastUrlService implements OnDestroy {

    private subscription: Subscription;

    private url: string;

    constructor(
        private router: Router,
        private location: Location,
    ) {}

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    get lastUrl(): Boolean {
        return this.url? true : false;
    }

    public back(): void {
        this.location.back();
    }

    public load() {
        this.subscription = this.router.events
        .pipe(
            filter((e: any) => e instanceof RoutesRecognized),
            pairwise()
        ).subscribe((e: any) => {
            this.url = e[0].urlAfterRedirects;
            console.log('the url', e[0].urlAfterRedirects); // previous url
        });
    }
}