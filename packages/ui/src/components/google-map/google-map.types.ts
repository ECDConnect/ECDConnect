export type MapCoordinates = {
  longitude: number;
  latitude: number;
};

export type GoogleMapGeoCodeAddressComponentType =
  | 'street_number'
  | 'route' // street name
  | 'sublocality' // suburb
  | 'locality' // Cape Town
  | 'administrative_area_level_2' // City of Cape Town Metropolitan Municipality
  | 'administrative_area_level_1' // Western Cape
  | 'country' // South Africa
  | 'postal_code';

export interface GoogleMapGeoCodeAddressType {
  long_name: string;
  short_name: string;
  types: GoogleMapGeoCodeAddressComponentType[];
}

export interface GoogleMapGeoCodeResponse {
  results: [
    {
      address_components: GoogleMapGeoCodeAddressType[];
      formatted_address: string;
      geometry: {
        location: {
          lat: number;
          lng: number;
        };
        location_type:
          | 'ROOFTOP'
          | 'RANGE_INTERPOLATED'
          | 'GEOMETRIC_CENTER'
          | 'APPROXIMATE';
        viewport: {
          northeast: {
            lat: number;
            lng: number;
          };
          southwest: {
            lat: number;
            lng: number;
          };
        };
      };
      place_id?: string;
      plus_code?: {
        compound_code: string;
        global_code: string;
      };
      types: string[];
    }
  ];
  status:
    | 'OK'
    | 'ZERO_RESULTS'
    | 'OVER_DAILY_LIMIT'
    | 'OVER_QUERY_LIMIT'
    | 'REQUEST_DENIED'
    | 'INVALID_REQUEST'
    | 'UNKNOWN_ERROR';
  error_message?: string;
}
