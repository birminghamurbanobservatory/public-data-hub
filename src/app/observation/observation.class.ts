export class Observation {
  public id?: string;
  public madeBySensor?: string;
  public hasResult?: Result;
  public ancestorPlatforms?: string[]; // has a hierachical structure, top level parent first.
  public inDeployment?: string[];
  public resultTime?: string;
  public observedProperty?: ObservedProperty;
  public hasFeatureOfInterest?: string;
  public location?: Location;
  public usedProcedures?: string[];
  public disciplines?: Discipline[];
}

class Result {
  value?: any;
  unit?: Unit;
  flags?: string[];
}

class Unit {
  '@id': string;
  label: string;
  symbol: string;
}

class Location {
  public id?: string;
  public geometry?: Geometry;
  public validAt?: string;
}

class Geometry {
  type?: string;
  coordinates?: any;
}

class ObservedProperty {
  '@id': string;
  label: string;
}

class Discipline {
  '@id': string;
  label: string; 
}