import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from "meteor/react-meteor-data";
import { connect } from 'react-redux';
import { ReactBingmaps } from 'react-bingmaps';
import PaypalBtn from 'react-paypal-checkout';
import KEYID from '../../constants/key_id';


const boundary = {
	"location":['chennai'],
	"option":{
	  entityType: 'PopulatedPlace'
	},
	"polygonStyle" :{
	  fillColor: 'rgba(161,224,255,0.4)',
	  strokeColor: '#a495b2',
	  strokeThickness: 2
	}
  };



const ChatListPage = ({isMapEnabled, isPaymentEnabled, keys}) => {
	let bingApi, paypalApi, client;
	if (keys && keys.length !== 0) {
		console.log('Keys in chat list page: ', keys);
		bingApi = keys.filter(key => key._id === KEYID.BING_MAP)[0].value;
		paypalApi = keys.filter(key => key._id === KEYID.PAYPAL)[0].value;
		client = {
			sandbox:    paypalApi.client_id,
			production: paypalApi.client_id,
		};
	}

	return (
		<div>
			<div>chat list page</div>
			{
				isMapEnabled && bingApi?
				(
					<div className="bingmap">
						<ReactBingmaps
							bingmapKey={bingApi}
							center={[13.0827, 80.2707]}
							mapTypeId = {"road"}
							navigationBarMode = {"compact"}
							boundary={boundary}
							style={{height: '100%'}}
						/>
					</div>
				):''
			}
			{
				isPaymentEnabled && paypalApi ?
				(
					<PaypalBtn client={client} currency={'USD'} total={1.00} />
				):''
			}
			
		</div>
	);
};

function mapStateToProps(state) {
	return {
		keys: state.KeyState.keys,
	};
}

const ChatListPageContainer = connect(mapStateToProps)(ChatListPage);


export default withTracker(() => {
	const features = Meteor.settings.public.FEATURE_FLAGS;
	const isMapEnabled = features.filter(feature => feature.id === 'USE_MAP')[0].enabled;
	const isPaymentEnabled = features.filter(feature => feature.id === 'USE_PAYMENT')[0].enabled;
	return {
		isMapEnabled,
		isPaymentEnabled,
	};
})(ChatListPageContainer);
