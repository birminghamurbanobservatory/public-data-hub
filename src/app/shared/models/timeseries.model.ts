import { ObservedProperty } from './observed-property.model';
import { Unit } from './unit.model';
import { Discipline } from './discipline.model';
import { Platform } from './platform.model';
import {Sensor} from './sensor.model';
import {Deployment} from './deployment.model';
import {Aggregation} from './aggregation.model';


export interface Timeseries {
  id?: string;
  type: string;
  colours?: { point: string, line: string, hover: string };
  startDate: string;
  endDate: string;
  observedProperty: ObservedProperty;
  aggregation: Aggregation;
  unit: Unit;
  madeBySensor: Sensor;
  ancestorPlatforms: Platform[];
  disciplines: Discipline[];
  hasDeployment: Deployment;
  hasFeatureOfInterest: string;
}