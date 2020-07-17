import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './Components/components.module';
import { HeaderComponent } from './header/header.component';
import { LastUrlService } from './Services/last-url/last-url.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ApiErrorInterceptor} from './shared/api-error-interceptor.interceptor';

@NgModule({

  declarations: [
    AppComponent,
    HeaderComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ComponentsModule,
    AppRoutingModule,
  ],

  providers: [
    LastUrlService,
    {
      provide: APP_INITIALIZER,
      useFactory: (lus: LastUrlService) => () => lus.load(),
      deps: [LastUrlService],
      multi: true,
    },
    {
      // Custom interceptor for handling errors from the Bham Urban Obs API
      provide: HTTP_INTERCEPTORS,
      useClass: ApiErrorInterceptor,
      multi: true
    }
  ],

  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
