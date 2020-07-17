import { Injectable, OnDestroy } from '@angular/core';
import { RoutesRecognized, Router } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastUrlService implements OnDestroy {

  private subscription: Subscription;
  private url: string;

  constructor(
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get lastUrl(): Boolean {
    return this.url? true : false;
  }

  public back(): void {
    this.router.navigateByUrl(this.url);
  }

  public load() {
    this.subscription = this.router.events
    .pipe(
      filter((e: any) => e instanceof RoutesRecognized),
      pairwise()
    ).subscribe((e: any) => {
      const url = this.router.url;
      const segments = url.split('/');
      if (segments[1] === 'map') {
        this.url = url;
      }
    });


  }
}