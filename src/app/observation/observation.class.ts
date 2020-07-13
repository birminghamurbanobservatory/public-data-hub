export class Observation {
  public id?: string;
  public madeBySensor?: any;
  public hasResult?: Result;
  public ancestorPlatforms?: any[]; // has a hierachical structure, top level parent first.
  public hasDeployment?: any;
  public resultTime?: any;
  public observedProperty?: any; // could be a string or object depending on "populate" query param.
  public aggregation?: any;
  public hasFeatureOfInterest?: any;
  public location?: Location;
  public usedProcedures?: any[];
  public disciplines?: any[]; // each item could be a string or object depending on "populate" query param.
  public phenomenonTime?: PhenomenonTime;
  public inTimeseries?: any;
}

class Result {
  value?: any;
  unit?: any; // could be a string or object depending on "populate" query param.
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