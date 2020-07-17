export interface MapMarker {
  id?: string;
  type?: string;
  labelText?: string;
  labelColour?: string;
  deployment?: string;
  position: { lat: number, lng: number }
  options?: Object;
}