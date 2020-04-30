import { Sensor } from 'src/app/sensor/sensor.class';

export class Platform {
  id?: string;
  name: string;
  description?: string;
  hosts?: Platform[] | undefined;
  ownerDeployment?: string;
  inDeployment?: string;
  isHostedBy?: string;
  ancestorPlatforms?: string[];
  static?: boolean;
  location?: Location; // could be a polygon
  centroid?: Location; // will always be a point
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

class Centroid {
  lat?: number;
  lng?: number;
  height?: number;
}

class LatLng {
  lat: number;
  lng: number;
}