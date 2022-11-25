import { ComponentBaseProps } from '@/../../../packages/ui/lib/models/ComponentBaseProps';
import { GoogleMap as Map } from '@capacitor/google-maps';
import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  MutableRefObject,
} from 'react';

type MapCoordinates = {
  longitude: number;
  latitude: number;
};

const apiKey = 'AIzaSyAmTVxElyncQJh2hJ1ATFS0K_cB6d3VoSk';

async function createMap(
  ref: MutableRefObject<HTMLElement> | any,
  { longitude, latitude }: MapCoordinates
): Promise<Map | null> {
  let map: Map;
  // let infoWindow: null; // TODO: implement information window

  if (Boolean(ref.current)) {
    try {
      map = await Map.create({
        id: 'google-map',
        element: ref.current,
        apiKey,
        config: {
          center: {
            lat: latitude,
            lng: longitude,
          },
          zoom: 15,
          disableDefaultUI: true,
        },
      });

      await map.addMarker({
        coordinate: {
          lat: latitude,
          lng: longitude,
        },
        draggable: true,
      });

      await map.enableCurrentLocation(true);
      await map.enableClustering();

      return Promise.resolve(map);
    } catch (error: any) {
      console.error(error);
      throw new Error('Unable to load map', error);
    }
  }
  return null;
}

function useGeoLocation() {
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      console.log('coords', coords);

      if (coords?.longitude) {
        setLongitude(coords?.longitude);
      }
      if (coords?.latitude) {
        setLatitude(coords?.latitude);
      }
    });
  });

  return {
    coords: {
      latitude,
      longitude,
    },
    setLatitude,
    setLongitude,
  };
}

function GoogleMap(
  props: ComponentBaseProps & { children?: React.ReactNode | undefined }
) {
  const mapRef = useRef<MutableRefObject<HTMLElement> | any>();
  const { coords, setLatitude, setLongitude } = useGeoLocation();

  useEffect(() => {
    if (coords?.longitude) {
      setLongitude(coords?.longitude);
    }

    if (coords?.latitude) {
      setLatitude(coords?.latitude);
    }
  });

  useLayoutEffect(() => {
    createMap(mapRef, coords);
  });

  return (
    <>
      <div className="component-wrapper">
        <div
          ref={mapRef}
          style={{
            display: 'inline-block',
            width: window.screen.width,
            height: window.screen.height / 2,
          }}
        />
      </div>
      {props?.children}
    </>
  );
}

export default GoogleMap;
