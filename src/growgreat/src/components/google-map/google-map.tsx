import { ComponentBaseProps } from '@ecdlink/ui';
import { GoogleMap } from '@capacitor/google-maps';
import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  MutableRefObject,
} from 'react';
import { MapCoordinates } from '@/components/google-map/google-map.types';
// import { GoogleMapInterface } from "@capacitor/google-maps/dist/typings/map";

async function useGoogleMap(
  ref: MutableRefObject<HTMLElement> | any,
  { latitude, longitude }: MapCoordinates
): Promise<GoogleMap | void> {
  let map: GoogleMap;

  async function initMaps() {
    map = await GoogleMap.create({
      id: 'google-map',
      element: ref.current,
      apiKey: process.env.REACT_APP_MAP_API_KEY as string,
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
  }

  // let infoWindow: null; // TODO: implement information window
  useLayoutEffect(() => {
    console.log('ref?.current', ref);

    initMaps();
  });
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

function CustomGoogleMap(
  props: ComponentBaseProps & { children?: React.ReactNode | undefined }
) {
  const mapRef = useRef();
  const { coords } = useGeoLocation();
  const map = useGoogleMap(mapRef, coords);

  useLayoutEffect(() => {
    console.log('map', mapRef);
    // if (mapRef?.current) {
    //   map(mapRef, coords);
    // }
  }, [map]);

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

export default CustomGoogleMap;
