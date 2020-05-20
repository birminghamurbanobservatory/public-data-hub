export class Observation {
  public id?: string;
  public madeBySensor?: string;
  public hasResult?: Result;
  public ancestorPlatforms?: string[]; // has a hierachical structure, top level parent first.
  public hasDeployment?: string;
  public resultTime?: string;
  public observedProperty?: any; // could be a string or object depending on "populate" query param.
  public aggregation: string;
  public hasFeatureOfInterest?: string;
  public location?: Location;
  public usedProcedures?: string[];
  public disciplines?: any[]; // each item could be a string or object depending on "populate" query param.
  public phenomenonTime?: PhenomenonTime;
  public inTimeseries?: []
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