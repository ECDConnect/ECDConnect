/*
import { ComponentBaseProps } from '@ecdlink/ui';
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

export interface Address {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleApiResponse {
  results: [
    {
      address_components: Address[];
      types: string[];
    }
  ];
}

function useGoogleMap(ref: MutableRefObject<HTMLElement> | any) {
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [address, setAddress] = useState<Address[] | undefined>();
  const [markerChanged, setMarkerChanged] = useState(false);

  const getAddress = useCallback(() => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=
        ${latitude},${longitude}&key=${process.env.REACT_APP_MAP_API_KEY}`)
      .then((response) => response.json())
      .then((data: GoogleApiResponse) => {
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
  };
}

function CustomGoogleMapComponent(
  props: ComponentBaseProps & {
    children?: React.ReactNode;
    height?: number;
    onChange?: (address?: Address[]) => void;
  }
) {
  const mapRef = useRef();

  const { address } = useGoogleMap(mapRef);

  useEffect(() => {
    if (props.onChange) {
      props.onChange(address);
    }
  }, [address, props]);

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
*/
