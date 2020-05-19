import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './map.component';
import { PlatformComponent } from './platform/platform.component';
import { ObservedPropertyComponent } from './observed-property/observed-property.component';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    children: [
      {
        path: 'platforms/:id',
        component: PlatformComponent,
      },
      {
        path: 'observed-property/:id',
        component: ObservedPropertyComponent,
      }
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

export class MapRoutingModule { }
