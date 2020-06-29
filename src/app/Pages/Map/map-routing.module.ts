import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './map.component';
import { PlatformsComponent } from './platforms/platforms.component';
import { PlatformDetailComponent } from './platform-detail/platform-detail.component';
import { ObservationsMapComponent } from './observations-map/observations-map.component';

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
        component: PlatformsComponent,
        children: [
          {
            path: ':id',
            component: PlatformDetailComponent,
          },
        ]
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
