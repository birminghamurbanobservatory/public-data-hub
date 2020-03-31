export class Observation {
  public id?: string;
  public madeBySensor?: string;
  public hasResult?: Result;
  public ancestorPlatform?: string[]; // has a hierachical structure, top level parent first.
  public inDeployment?: string[];
  public resultTime?: string;
  public observedProperty?: string;
  public hasFeatureOfInterest?: string;
  public location?: Location;
  public usedProcedure?: string[];
  public discipline?: string[];
}

class Result {
  value?: any;
  unit?: string;
  flags?: string[];
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