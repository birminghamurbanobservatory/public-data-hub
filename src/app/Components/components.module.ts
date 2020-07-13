import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GoogleMapComponent } from './GoogleMap/google-map.component';
import { LineChartComponent } from './LineChart/line-chart.component';
import { ObservationModalComponent } from './ObservationModal/observation-modal.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { DirectivesModule } from '../Directives/directives.module';
import { ColumnChartComponent } from './ColumnChart/column-chart.component';
import {AirQualityLineChartComponent} from './AirQualityLineChart/air-quality-line-chart.component';
import {WindDirectionLineChartComponent} from './WindDirectionLineChart/wind-direction-line-chart.component';
import {TotalComponent} from './Total/total.component';


@NgModule({

    imports: [
        CommonModule,
        DirectivesModule,
        RouterModule,
        TooltipModule,
    ],

    declarations: [
        GoogleMapComponent,
        ObservationModalComponent,
        ColumnChartComponent,
        LineChartComponent,
        AirQualityLineChartComponent,
        WindDirectionLineChartComponent,
        TotalComponent
    ],

    exports: [
        GoogleMapComponent,
        ObservationModalComponent,
        ColumnChartComponent,
        LineChartComponent,
        AirQualityLineChartComponent,
        WindDirectionLineChartComponent,
        TotalComponent
    ]

})
export class ComponentsModule { }
