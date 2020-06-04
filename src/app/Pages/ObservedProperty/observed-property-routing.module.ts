import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObservedPropertyComponent } from './observed-property.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':platform/:property',
        component: ObservedPropertyComponent
      },
    ]
  }
];

@NgModule({

  imports: [
    RouterModule.forChild(routes),
  ],

  exports: [
    RouterModule,
  ]

})

export class ObservedPropertyRoutingModule { }
