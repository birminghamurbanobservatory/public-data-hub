export interface MapMarker {
    id?: string;
    type?: string;
    deployment?: string;
    position: { lat: number, lng: number }
    options?: Object;
}