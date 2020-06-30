import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './Components/components.module';
import { HeaderComponent } from './header/header.component';
import { LastUrlService } from './Services/last-url/last-url.service';

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
    }
  ],

  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
