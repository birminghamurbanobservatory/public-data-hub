export interface GetObservationsWhere {
  madeBySensor?: any; // a string or {in: ['sensor1', 'sensor2']}
  observedProperty?: string;
  aggregation?: any;
  disciplines?: Disciplines;
  resultTime?: ResultTime;
  duration?: any;
  ancestorPlatforms?: any; // ['parent', 'child'] for exact match or {includes: 'platform-1'} to match a single platform anywhere in the platform "tree".
  flags?: Flags;
  location?: Location;
  // Should also be able to provide these query params in the same format that the server expects them, e.g. resultTime__gt.
}


interface Disciplines {
  includes: string;
}

interface Flags {
  exists: boolean;
}

interface Location {
  exists: true;
}

interface ResultTime {
  gt?: string; // i.e. an isoString. TODO: Accept as a JS Date object too?
  gte?: string;
  lt?: string;
  lte?: string;
}