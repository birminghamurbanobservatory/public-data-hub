import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./Pages/Home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'platform-detail',
    loadChildren: () => import('./Pages/PlatformDetail/platform-detail.module').then(m => m.PlatformDetailModule),
  },
  {
    path: 'observe',
    loadChildren: () => import('./Pages/ObservedProprty/observed-property.module').then(m => m.ObservedPropertyModule)
  }
];

@NgModule({

  imports: [
    RouterModule.forRoot(routes),
  ],

  exports: [
    RouterModule,
  ]

})

export class AppRoutingModule { }
