export class Collection {
  '@context': any;
  member: any[]; // e.g. an array of platforms, sensors, observations
  meta: any; // comes in handy for pagination. TODO: Si Bell to define this once a solution is agreed.
}