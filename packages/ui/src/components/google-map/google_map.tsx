import { GoogleMap } from '@capacitor/google-maps';
import {
  useRef,
  useLayoutEffect,
  useCallback,
  memo,
  useState,
  useEffect,
  ReactNode,
  FC,
} from 'react';
import { GoogleMapGeoCodeResponse, MapCoordinates } from './google-map.types';
import { ComponentBaseProps } from '../../models/ComponentBaseProps';

const DEFAULT_LONGITUDE = 26.058415;
const DEFAULT_LATITUDE = -29.1199066;
const GEOLOCATION_TIMEOUT = 10000;
const MAP_API_KEY = import.meta.env.REACT_APP_MAP_API_KEY || '';

// Each mounted map needs its own id, otherwise a map created by a later mount
// reuses the previous map's id and the stale drag listener keeps firing.
let mapInstanceCount = 0;

// The browser key is referer restricted so the Maps JavaScript API accepts it,
// but the Geocoding *web service* rejects referer restricted keys outright
// ("API keys with referer restrictions cannot be used with this API"), which
// left every reverse geocode returning REQUEST_DENIED. The JavaScript geocoder
// is loaded alongside the map and works with the same key, so use it first and
// only fall back to the REST endpoint (which needs an unrestricted key).
const geocodeWithMapsJs = (
  lat: number,
  lng: number
): Promise<GoogleMapGeoCodeResponse | undefined> => {
  const maps = (window as any)?.google?.maps;
  if (!maps?.Geocoder) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve) => {
    new maps.Geocoder().geocode(
      { location: { lat, lng } },
      (results: any[] | null, status: string) => {
        if (status !== 'OK' || !results?.length) {
          resolve(undefined);
          return;
        }

        resolve({
          status: 'OK',
          // The JS geocoder returns LatLng objects where the REST response has
          // plain numbers - normalise so both paths hand back the same shape.
          results: results.map((result) => ({
            ...result,
            geometry: {
              ...result.geometry,
              location: {
                lat: result.geometry?.location?.lat?.() ?? lat,
                lng: result.geometry?.location?.lng?.() ?? lng,
              },
            },
          })),
        } as GoogleMapGeoCodeResponse);
      }
    );
  });
};

const geocodeWithRestApi = (
  lat: number,
  lng: number
): Promise<GoogleMapGeoCodeResponse | undefined> => {
  const params = new URLSearchParams({
    latlng: `${lat},${lng}`,
    key: MAP_API_KEY,
  });

  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)
    .then((response) => response.json())
    .then((data: GoogleMapGeoCodeResponse) =>
      data.status === 'OK' && data.results?.length ? data : undefined
    )
    .catch(() => undefined);
};

export type CustomGoogleMapComponentProps = ComponentBaseProps & {
  children?: ReactNode;
  height?: number;
  longitude?: number | null;
  latitude?: number | null;
  onChangeMapData?: (
    mapData?: GoogleMapGeoCodeResponse,
    coordinates?: MapCoordinates
  ) => void;
};

const CustomGoogleMapComponent: FC<CustomGoogleMapComponentProps> = (props) => {
  const mapRef = useRef();
  const mapIdRef = useRef(`google-map-${(mapInstanceCount += 1)}`);
  const mapInstanceRef = useRef<GoogleMap | null>(null);
  const isMountedRef = useRef(true);
  const onChangeMapDataRef = useRef(props.onChangeMapData);
  onChangeMapDataRef.current = props.onChangeMapData;
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [inititialCoordsSet, setInitialCoordsSet] = useState<boolean>(false);
  const [longitude, setLongitude] = useState<number>(
    props.longitude === undefined || props.longitude === null
      ? DEFAULT_LONGITUDE
      : props.longitude
  );
  const [latitude, setLatitude] = useState<number>(
    props.latitude === undefined || props.latitude === null
      ? DEFAULT_LATITUDE
      : props.latitude
  );

  const getCoordData = useCallback(async (lat?: number, lng?: number) => {
    if (
      lat === undefined ||
      lng === undefined ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      return;
    }

    try {
      const mapData =
        (await geocodeWithMapsJs(lat, lng)) ??
        (await geocodeWithRestApi(lat, lng));

      if (!isMountedRef.current || !mapData) return;

      onChangeMapDataRef.current?.(mapData, {
        latitude: lat,
        longitude: lng,
      });
    } catch (error) {
      console.warn('Failed to reverse geocode map pin:', error);
    }
  }, []);

  const initMaps = async () => {
    if (!!map) return;
    if (!mapRef.current) return;

    let newMap: GoogleMap = await GoogleMap.create({
      id: mapIdRef.current,
      element: mapRef.current as HTMLElement,
      apiKey: MAP_API_KEY,
      config: {
        center: {
          lat: latitude,
          lng: longitude,
        },
        zoom: 15,
        disableDefaultUI: true,
      },
    });
    mapInstanceRef.current = newMap;
    setMap(newMap);

    await newMap.setOnMarkerDragEndListener((event) => {
      setLongitude(event?.longitude);
      setLatitude(event?.latitude);
      getCoordData(event?.latitude, event?.longitude);
    });

    await newMap.addMarker({
      coordinate: {
        lat: latitude,
        lng: longitude,
      },
      draggable: true,
    });

    getCoordData(latitude, longitude);
  };

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      const instance = mapInstanceRef.current;
      mapInstanceRef.current = null;
      instance?.destroy().catch(() => undefined);
    };
  }, []);

  useLayoutEffect(() => {
    const hasInitialCoords =
      props.latitude !== undefined &&
      props.latitude !== null &&
      props.longitude !== undefined &&
      props.longitude !== null;

    if (hasInitialCoords) {
      setLatitude(props.latitude as number);
      setLongitude(props.longitude as number);
      setInitialCoordsSet(true);
      return;
    }

    if (!navigator.geolocation) {
      setInitialCoordsSet(true);
      return;
    }

    let settled = false;
    const useCoords = (lat: number, lng: number) => {
      if (settled) return;
      settled = true;
      setLatitude(lat);
      setLongitude(lng);
      setInitialCoordsSet(true);
    };

    // getCurrentPosition never calls back when the permission prompt is simply
    // dismissed, which used to leave the map uninitialised for anyone without a
    // saved location. Always fall through to the default after the timeout.
    const fallbackTimer = window.setTimeout(
      () => useCoords(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
      GEOLOCATION_TIMEOUT
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.clearTimeout(fallbackTimer);
        const { latitude: lat, longitude: lng } = position?.coords || {};
        useCoords(lat || DEFAULT_LATITUDE, lng || DEFAULT_LONGITUDE);
      },
      (error) => {
        window.clearTimeout(fallbackTimer);
        console.warn(`Defaulting map location: ${error.message}`);
        useCoords(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
      },
      {
        enableHighAccuracy: true,
        timeout: GEOLOCATION_TIMEOUT,
        maximumAge: 0,
      }
    );

    return () => window.clearTimeout(fallbackTimer);
  }, []);

  useLayoutEffect(() => {
    if (!inititialCoordsSet) return;
    (async () => {
      await initMaps();
    })();
  }, [inititialCoordsSet, mapRef]);

  return (
    <>
      <div className="component-wrapper">
        <capacitor-google-map
          ref={mapRef}
          style={{
            display: 'inline-block',
            width: '100%',
            height: props.height || window.screen.height / 2,
          }}
        />
      </div>
      {props.children}
    </>
  );
};

export const CustomGoogleMap = memo(CustomGoogleMapComponent);
