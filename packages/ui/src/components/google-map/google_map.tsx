import { GoogleMap } from '@capacitor/google-maps';
import {
  useRef,
  useLayoutEffect,
  MutableRefObject,
  useCallback,
  memo,
  useState,
  useEffect,
} from 'react';
import { ComponentBaseProps } from '../../models';
import {
  GoogleMapGeoCodeAddressType,
  GoogleMapGeoCodeResponse,
} from './google-map.types';

function useGoogleMap(
  ref: MutableRefObject<HTMLElement> | any,
  defaultLongitude?: number | null,
  defaultLatitude?: number
) {
  const [longitude, setLongitude] = useState(
    defaultLongitude === undefined || defaultLongitude === null
      ? -29.1199066
      : defaultLongitude
  );
  const [latitude, setLatitude] = useState(
    defaultLatitude === undefined || defaultLongitude === null
      ? 26.058415
      : defaultLatitude
  );
  const [address, setAddress] = useState<
    GoogleMapGeoCodeAddressType[] | undefined
  >();
  const [mapData, setMapData] = useState<
    GoogleMapGeoCodeResponse | undefined
  >();
  const [markerChanged, setMarkerChanged] = useState(false);

  const getAddress = useCallback(() => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=
        ${latitude},${longitude}&key=${process.env.REACT_APP_MAP_API_KEY}`)
      .then((response) => response.json())
      .then((data: GoogleMapGeoCodeResponse) => {
        if (data.results.length) {
          setAddress(
            data.results.find((result) =>
              result.address_components.find((address) =>
                address.types.find(
                  (type) =>
                    type.includes('street_number') || type.includes('route')
                )
              )
            )?.address_components
          );
          setMapData(data);
        }
      });
  }, [latitude, longitude]);

  const initMaps = useCallback(async () => {
    let map: GoogleMap = await GoogleMap.create({
      id: 'google-map',
      element: ref.current,
      apiKey: process.env.REACT_APP_MAP_API_KEY || '',
      config: {
        center: {
          lat: latitude,
          lng: longitude,
        },
        zoom: 15,
        disableDefaultUI: true,
      },
    });

    const markerId = await map.addMarker({
      coordinate: {
        lat: latitude,
        lng: longitude,
      },
      draggable: true,
    });

    await map.setOnMarkerDragEndListener((event) => {
      setMarkerChanged(true);
      setLongitude(event?.longitude);
      setLatitude(event?.latitude);
    });

    if (markerChanged) {
      map.removeMarker(markerId);

      await map.addMarker({
        coordinate: {
          lat: latitude,
          lng: longitude,
        },
        draggable: true,
      });

      setMarkerChanged(false);
      getAddress();
    }
  }, [markerChanged, getAddress, latitude, longitude, ref]);

  useLayoutEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      if (coords?.longitude) {
        setLongitude(coords?.longitude);
      }
      if (coords?.latitude) {
        setLatitude(coords?.latitude);
      }
    });
  }, []);

  useLayoutEffect(() => {
    initMaps();
  }, [initMaps]);

  useEffect(() => {
    if (!address) {
      getAddress();
    }
  }, [address, getAddress]);

  return {
    address,
    coords: {
      latitude,
      longitude,
    },
    setLatitude,
    setLongitude,
    mapData,
  };
}

function CustomGoogleMapComponent(
  props: ComponentBaseProps & {
    children?: React.ReactNode;
    height?: number;
    longitude?: number | null;
    latitude?: number | null;
    onChange?: (address?: GoogleMapGeoCodeAddressType[]) => void;
    onChangeMapData?: (mapData?: GoogleMapGeoCodeResponse) => void;
  }
) {
  const mapRef = useRef();

  const { address, mapData } = useGoogleMap(
    mapRef,
    props.longitude,
    props.latitude
  );

  useEffect(() => {
    if (props.onChange) {
      props.onChange(address);
    }
  }, [address, props]);

  useEffect(() => {
    if (props.onChangeMapData) {
      props.onChangeMapData(mapData);
    }
  }, [mapData, props]);

  return (
    <>
      <div className="component-wrapper">
        <capacitor-google-map
          ref={mapRef}
          style={{
            display: 'inline-block',
            width: window.screen.width,
            height: props.height || window.screen.height / 2,
          }}
        />
      </div>
      {props.children}
    </>
  );
}

export const CustomGoogleMap = memo(CustomGoogleMapComponent);
