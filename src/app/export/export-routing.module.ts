import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TimeseriesExportComponent} from './timeseries-export/timeseries-export.component';


const routes: Routes = [
  {
    path: ':timeseriesId',
    component: TimeseriesExportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportRoutingModule { }
