import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'map',
    loadChildren: () => import('./Pages/Map/map.module').then(m => m.MapModule),
  },
  {
    path: 'platform-detail',
    loadChildren: () => import('./Pages/PlatformDetail/platform-detail.module').then(m => m.PlatformDetailModule),
  },
  {
    path: 'observe',
    loadChildren: () => import('./Pages/ObservedProprty/observed-property.module').then(m => m.ObservedPropertyModule)
  },
  {
    path: '',
    redirectTo: '/map',
    pathMatch: 'full',
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
