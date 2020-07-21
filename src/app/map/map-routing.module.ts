import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './map.component';
import { ObservationsMapComponent } from './observations-map/observations-map.component';
import {PlatformsMapComponent} from './platforms-map/platforms-map';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/map/platforms',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MapComponent,
    children: [
      {
        path: 'platforms',
        component: PlatformsMapComponent,
      },
      {
        path: 'observations',
        component: ObservationsMapComponent,
      },
    ]
  },
  
];

@NgModule({

  imports: [
    RouterModule.forChild(routes),
  ],

  exports: [
    RouterModule,
  ]

})
export class MapRoutingModule {}
