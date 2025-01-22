'use client';

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React from 'react';

type mapData = {
  lat: string | undefined;
  lng: string | undefined;
  name: string | undefined;
  address: string | undefined;
};

const MapComponent = ({ lat, lng, name, address }: mapData) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });
  if (!isLoaded) return <div>Loading Google Maps...</div>;
  if (loadError) return <div>Error loading Google Maps</div>;

  return (
    <div className="">
      <GoogleMap
        center={{ lat: parseFloat(lat!), lng: parseFloat(lng!) }}
        zoom={14}
        options={{
          disableDefaultUI: true,
        }}
        mapContainerStyle={{ width: '100%', height: '217px', borderRadius: 8 }}
      >
        <Marker
          position={{ lat: parseFloat(lat!), lng: parseFloat(lng!) }}
          title={name}
        />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
