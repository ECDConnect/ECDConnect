import { useRef } from 'react';
import { GoogleMap as Map } from '@capacitor/google-maps';

function GoogleMap() {
  const mapRef = useRef<HTMLElement>();
  async function createMap() {
    if (!!mapRef.current) {
      return await Map.create({
        id: 'my-cool-map',
        element: mapRef.current,
        apiKey: 'AIzaSyAmTVxElyncQJh2hJ1ATFS0K_cB6d3VoSk',
        config: {
          center: {
            lat: 33.6,
            lng: -117.9,
          },
          zoom: 8,
        },
      });
    }

    return null;
  }

  return (
    <div className="component-wrapper">
      <capacitor-google-map
        ref={mapRef}
        style={{
          display: 'inline-block',
          width: window.screen.width,
          height: window.screen.height / 3,
        }}
      />
      <button onClick={createMap}>Create Map</button>
    </div>
  );
}

export default GoogleMap;
