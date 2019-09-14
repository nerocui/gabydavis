import React from "react";
import { ReactBingmaps } from 'react-bingmaps';
import KEYS from '../../config/keys';

const MapComponent = () => {
  return (
    <ReactBingmaps bingmapKey={KEYS.BING_MAP_API} center={[13.0827, 80.2707]}/>
  );
}

export default MapComponent;
