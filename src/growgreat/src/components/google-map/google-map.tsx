import { ComponentBaseProps } from '@ecdlink/ui/lib';
import { GoogleMap as Map } from '@capacitor/google-maps';
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

async function createMap(
  ref: MutableRefObject<HTMLElement | undefined>,
  { longitude, latitude }: { latitude: number; longitude: number }
): Promise<Map | null> {
  let map: Map;

  if (!!ref.current) {
    map = await Map.create({
      id: 'google-map',
      element: ref.current,

      apiKey: 'AIzaSyAmTVxElyncQJh2hJ1ATFS0K_cB6d3VoSk',
      config: {
        center: {
          lat: latitude,
          lng: longitude,
        },
        zoom: 17,
      },
    });

    await map.addMarker({
      coordinate: {
        lat: latitude,
        lng: longitude,
      },
      draggable: true,
    });

    map.setMapType = async () => {
      'Normal';
    };

    await map.enableClustering();

    return map;
  }
  return null;
}

function GoogleMap(props: ComponentBaseProps) {
  const mapRef = useRef<HTMLElement>();
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
  }, [latitude, setLatitude, longitude, setLongitude]);

  useLayoutEffect(() => {
    createMap(mapRef, { latitude, longitude });
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
