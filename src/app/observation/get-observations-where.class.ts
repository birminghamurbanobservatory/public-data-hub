export class GetObservationsWhere {
  public madeBySensor?: any; // a string or {in: ['sensor1', 'sensor2']}
  public observedProperty?: string;
  public discipline?: Discipline;
  public onePer?: string; // i.e. 'sensor' or 'timeseries'
  public resultTime?: ResultTime;
  public ancestorPlatform?: any; // ['parent', 'child'] for exact match or {includes: 'platform-1'} to match a single platform anywhere in the platform "tree".
  public flag?: Flag;
}


class Discipline {
  includes: string;
}

class Flag {
  exists: boolean;
}

class ResultTime {
  gt?: string; // i.e. an isoString. TODO: Accept as a JS Date object too?
  gte?: string;
  lt?: string;
  lte?: string;
}