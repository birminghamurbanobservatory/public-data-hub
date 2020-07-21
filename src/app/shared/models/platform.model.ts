import { Sensor } from './sensor.model';

export interface Platform {
  id?: string;
  label: string;
  description?: string;
  hosts?: Platform[] | undefined;
  ownerDeployment?: string;
  inDeployment?: string;
  isHostedBy?: string;
  ancestorPlatforms?: string[];
  static?: boolean;
  location?: Location; // always a point for platforms
  updateLocationWithSensor?: string;
  createdAt?: string;
  updatedAt?: string;
  initialSelection?: boolean; // used to highlight a map pin if platform selected on page load
}

interface Location {
  id?: string;
  geometry?: Geometry;
  properties: LocationProperties;
  forMap?: LatLng;
}

interface LocationProperties {
  validAt?: string;
}

interface Geometry {
  type?: string;
  coordinates?: any;
}

interface LatLng {
  lat: number;
  lng: number;
}