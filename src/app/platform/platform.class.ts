import { Sensor } from 'src/app/sensor/sensor.class';

export class Platform {
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
}

class Location {
  id?: string;
  geometry?: Geometry;
  properties: LocationProperties;
  forMap?: LatLng;
}

class LocationProperties {
  validAt?: string;
}

class Geometry {
  type?: string;
  coordinates?: any;
}

class LatLng {
  lat: number;
  lng: number;
}