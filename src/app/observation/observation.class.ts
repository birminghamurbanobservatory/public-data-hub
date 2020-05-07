import { ObservedProperty } from '../Interfaces/observed-property.interface';
import { Unit } from '../Interfaces/unit.interface';
import { Discipline } from '../Interfaces/disciplines.interface';

export class Observation {
  public id?: string;
  public madeBySensor?: string;
  public hasResult?: Result;
  public ancestorPlatforms?: string[]; // has a hierachical structure, top level parent first.
  public hasDeployment?: string;
  public resultTime?: string;
  public observedProperty?: ObservedProperty;
  public aggreation: string;
  public hasFeatureOfInterest?: string;
  public location?: Location;
  public usedProcedures?: string[];
  public disciplines?: Discipline[];
  public phenomenonTime?: PhenomenonTime;
  public inTimeseries?: []
}

class Result {
  value?: any;
  unit?: Unit;
  flags?: string[];
}

class Location {
  public id?: string;
  public geometry?: Geometry;
  public properties: LocationProperties;
}

class LocationProperties {
  validAt?: string;
}

class Geometry {
  type?: string;
  coordinates?: any;
}

class PhenomenonTime {
  hasBeginning: string;
  hasEnd: string;
  duration: number;
}