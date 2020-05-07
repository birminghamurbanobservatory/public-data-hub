export class GetObservationsWhere {
  public madeBySensor?: any; // a string or {in: ['sensor1', 'sensor2']}
  public observedProperty?: string;
  public aggregation?: any;
  public disciplines?: Disciplines;
  public onePer?: string; // i.e. 'sensor' or 'timeseries'
  public resultTime?: ResultTime;
  public duration?: any;
  public ancestorPlatforms?: any; // ['parent', 'child'] for exact match or {includes: 'platform-1'} to match a single platform anywhere in the platform "tree".
  public flags?: Flags;
  public limit?: number;
  public sortBy?: string;
  public sortOrder?: string;
}


class Disciplines {
  includes: string;
}

class Flags {
  exists: boolean;
}

class ResultTime {
  gt?: string; // i.e. an isoString. TODO: Accept as a JS Date object too?
  gte?: string;
  lt?: string;
  lte?: string;
}