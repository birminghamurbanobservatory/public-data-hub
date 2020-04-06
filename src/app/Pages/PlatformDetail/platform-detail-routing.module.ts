import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlatformDetailComponent } from './platform-detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':id',
        component: PlatformDetailComponent
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

export class PlatformDetailRoutingModule { }
