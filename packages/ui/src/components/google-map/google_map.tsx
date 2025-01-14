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
import { GoogleMapGeoCodeResponse } from './google-map.types';
import { ComponentBaseProps } from '../../models/ComponentBaseProps';

const DEFAULT_LONGITUDE = 26.058415;
const DEFAULT_LATITUDE = -29.1199066;

export type CustomGoogleMapComponentProps = ComponentBaseProps & {
  children?: ReactNode;
  height?: number;
  longitude?: number | null;
  latitude?: number | null;
  onChangeMapData?: (mapData?: GoogleMapGeoCodeResponse) => void;
};

const CustomGoogleMapComponent: FC<CustomGoogleMapComponentProps> = (props) => {
  const mapRef = useRef();
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
  const [mapData, setMapData] = useState<
    GoogleMapGeoCodeResponse | undefined
  >();

  const getCoordData = useCallback((lat: number, lng: number) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=
        ${lat},${lng}&key=${process.env.REACT_APP_MAP_API_KEY}`)
      .then((response) => response.json())
      .then((data: GoogleMapGeoCodeResponse) => {
        if (data.results.length) {
          const valid = data.results.find((result) =>
            result.address_components.find((address) =>
              address.types.find(
                (type) =>
                  type.includes('street_number') || type.includes('route')
              )
            )
          );
          if (!!valid) setMapData(data);
        }
      });
  }, []);

  const initMaps = async () => {
    if (!!map) return;
    if (!mapRef.current) return;

    let newMap: GoogleMap = await GoogleMap.create({
      id: 'google-map',
      element: mapRef.current as HTMLElement,
      apiKey:
        process.env.REACT_APP_MAP_API_KEY ||
        'AIzaSyAmTVxElyncQJh2hJ1ATFS0K_cB6d3VoSk',
      config: {
        center: {
          lat: latitude,
          lng: longitude,
        },
        zoom: 15,
        disableDefaultUI: true,
      },
    });
    setMap(newMap);

    await newMap.setOnMarkerDragEndListener((event) => {
      setLongitude(event?.longitude);
      setLatitude(event?.latitude);
      console.log('setOnMarkerDragEndListener');
      getCoordData(event?.latitude, event?.longitude);
    });

    await newMap.addMarker({
      coordinate: {
        lat: latitude,
        lng: longitude,
      },
      draggable: true,
    });
  };

  useEffect(() => {
    if (props.onChangeMapData) {
      props.onChangeMapData(mapData);
    }
  }, [mapData, props.onChangeMapData]);

  useLayoutEffect(() => {
    if (longitude === DEFAULT_LONGITUDE && latitude === DEFAULT_LATITUDE) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!!position.coords?.longitude && !!position.coords.latitude) {
            setLongitude(position.coords.longitude);
            setLatitude(position.coords.latitude);
          } else {
            setLongitude(props.longitude || DEFAULT_LONGITUDE);
            setLatitude(props.latitude || DEFAULT_LATITUDE);
          }
          setInitialCoordsSet(true);
        },
        (error) => {
          console.warn(`Defaulting map location: ${error.message}`);
          setLongitude(props.longitude || DEFAULT_LONGITUDE);
          setLatitude(props.latitude || DEFAULT_LATITUDE);
          setInitialCoordsSet(true);
        }
      );
    } else {
      setLongitude(props.longitude || DEFAULT_LONGITUDE);
      setLatitude(props.latitude || DEFAULT_LATITUDE);
      setInitialCoordsSet(true);
    }
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
