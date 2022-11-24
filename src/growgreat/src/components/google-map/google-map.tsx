import { ComponentBaseProps } from '@ecdlink/ui/lib';
import { GoogleMap as Map } from '@capacitor/google-maps';
import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  MutableRefObject,
} from 'react';

async function createMap(
  ref: MutableRefObject<HTMLElement | undefined>,
  { longitude, latitude }: { latitude: number; longitude: number }
): Promise<Map | null> {
  let map: Map;
  // let infoWindow: null; // TODO: implement information window

  if (!!ref.current) {
    try {
      map = await Map.create({
        id: 'google-map',
        element: ref.current,
        apiKey: 'AIzaSyAmTVxElyncQJh2hJ1ATFS0K_cB6d3VoSk',
        config: {
          center: {
            lat: latitude,
            lng: longitude,
          },
          zoom: 15,
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

      return map;
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

function GoogleMap(props: ComponentBaseProps) {
  const { coords, setLatitude, setLongitude } = useGeoLocation();
  const mapRef = useRef<HTMLElement | undefined>();
  const map: Promise<Map | null> = createMap(mapRef, coords);

  useEffect(() => {
    if (coords?.longitude) {
      setLongitude(coords?.longitude);
    }

    if (coords?.latitude) {
      setLatitude(coords?.latitude);
    }
  });

  useLayoutEffect(() => {
    console.log('map object', map);
  });

  return (
    <>
      <div className="component-wrapper">
        <capacitor-google-map
          ref={mapRef}
          style={{
            display: 'inline-block',
            width: window.screen.width,
            height: window.screen.height / 2,
          }}
        />
      </div>
      {props.children}
    </>
  );
}

export default GoogleMap;
