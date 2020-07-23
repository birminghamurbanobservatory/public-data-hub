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

  get lastUrl(): string {
    return this.url;
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
      this.url = this.router.url;
    });
  }

  
}