import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlotComponent } from './plot.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':platform/:property',
        component: PlotComponent
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

export class PlotRoutingModule {}
