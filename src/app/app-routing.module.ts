import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then(m => m.MapModule),
  },
  {
    path: 'plot',
    loadChildren: () => import('./plot/plot.module').then(m => m.PlotModule),
  },
  {
    path: 'observation',
    loadChildren: () => import('./observation/observation.module').then(m => m.ObservationModule),
  },
  {
    path: 'download',
    loadChildren: () => import('./export/export.module').then(m => m.ExportModule),
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
