export interface Timeseries {
  id?: string;
  type: string;
  colours?: { point: string, line: string, hover: string };
  startDate: Date;
  endDate: Date;
  observedProperty: any;
  aggregation: any;
  unit: any;
  madeBySensor: any;
  ancestorPlatforms: any[];
  disciplines: any[];
  hasDeployment: any;
  hasFeatureOfInterest: any;
  usedProcedures: any;
}