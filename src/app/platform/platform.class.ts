export class Platform {
  id?: string;
  name: string;
  description?: string;
  ownerDeployment?: string;
  inDeployments?: string[];
  isHostedBy?: string;
  ancestorPlatform?: string[];
  static?: boolean;
  location?: Location;
  updateLocationWithSensor?: string;
  createdAt?: string;
  updatedAt?: string;
}

class Location {
  id?: string;
  geometry?: Geometry;
  validAt?: string;
  forMap?: LatLng;
}

class Geometry {
  type?: string;
  coordinates?: any;
}

class LatLng {
  lat: number;
  lng: number;
}