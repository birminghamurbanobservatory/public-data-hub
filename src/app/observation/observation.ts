export class Observation {
  public id?: string;
  public madeBySensor?: string;
  public hasResult?: Result;
  public isHostedBy?: string[];
  public inDeployment?: string[];
  public resultTime?: string;
  public hasFeatureOfInterest?: string;
  public location?: Location;
  public observedProperty?: string;
  public usedProcedure?: string[];
}

class Result {
  value?: any;
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