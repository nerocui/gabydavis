import React from "react";
import { ReactBingmaps } from 'react-bingmaps';
import { connect } from 'react-redux';
import KEYID from "../../constants/key_id";

const MapComponent = ({boundary, keys}) => {
  if (keys && keys.length !== 0) {
    const bingApi = keys.filter(
      key => key._id === KEYID.BING_MAP
    )[0].value;
    return (
      <ReactBingmaps
        bingmapKey={bingApi}
        mapTypeId={"road"}
        navigationBarMode={"compact"}
        boundary={boundary}
        center = {[13.0827, 80.2707]}
        style={{ height: "100%" }}
      />
    );
  }
  return "";
}

function mapStateToProps(state) {
  return {
    keys: state.KeyState.keys,
  };
}

export default connect(mapStateToProps)(MapComponent);
