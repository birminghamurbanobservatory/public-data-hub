import { ObservedProperty } from '../../Interfaces/observed-property.interface';
import { Unit } from '../../Interfaces/unit.interface';
import { MadeBySensor } from '../../Interfaces/made-by-sensor.interface';
import { Discipline } from '../../Interfaces/disciplines.interface';
import { Platform } from '../../platform/platform.class';

export class Timeseries {
    id?: string;
    type: string;
    startDate: string;
    endDate: string;
    observedProperty: ObservedProperty;
    unit: Unit;
    madeBySensor: MadeBySensor;
    ancestorPlatforms: Platform[];
    disciplines: Discipline[];
    hasFeatureOfInterest: string;
}