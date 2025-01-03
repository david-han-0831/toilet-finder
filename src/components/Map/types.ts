export interface MapProps {
  center?: google.maps.LatLngLiteral;
  markers?: Array<{
    id: string;
    position: google.maps.LatLngLiteral;
    data?: any;
  }>;
  onMarkerClick?: (id: string) => void;
  zoom?: number;
  containerClassName?: string;
} 