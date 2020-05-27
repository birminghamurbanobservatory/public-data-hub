import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './map.component';
import { PlatformsComponent } from './platforms/platforms.component';
import { PlatformDetailComponent } from './platform-detail/platform-detail.component';
import { ObservedPropertyComponent } from './observed-property/observed-property.component';

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
        path: 'observed-property/:id',
        component: ObservedPropertyComponent,
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
