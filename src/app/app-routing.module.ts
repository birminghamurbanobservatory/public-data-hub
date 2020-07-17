import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'map',
    loadChildren: () => import('./Pages/Map/map.module').then(m => m.MapModule),
  },
  {
    path: 'plot',
    loadChildren: () => import('./Pages/Plot/plot.module').then(m => m.PlotModule),
  },
  {
    path: 'observation',
    loadChildren: () => import('./Pages/Observation/observation.module').then(m => m.ObservationModule),
  },
  {
    path: '',
    redirectTo: '/map/platforms',
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
