export class Platform {
  id?: string;
  name: string;
  description?: string;
  ownerDeployment?: string;
  inDeployments?: string[];
  isHostedBy?: string;
  ancestorPlatforms?: string[];
  static?: boolean;
  location?: Location;
  updateLocationWithSensor?: string;
  createdAt?: string;
  updatedAt?: string;
}

class Location {
  id?: string;
  geometry?: Geometry;
  centroid?: Centroid;
  validAt?: string;
  forMap?: LatLng;
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