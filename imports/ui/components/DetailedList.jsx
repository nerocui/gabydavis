import React from "react";
import {
	Fabric,
	MarqueeSelection,
	DetailsList,
	Selection,
	SelectionMode,
	DetailsListLayoutMode,
	HoverCard,
	HoverCardType,
	PersonaInitialsColor,
	Persona,
	PersonaSize,
	Text,
} from 'office-ui-fabric-react';
import { connect } from 'react-redux';
import { getColumns } from '../../util/templateUtil';

const DetailedList = ({selection, items, onItemInvoked}) => {

	return (
		<Fabric>
			<MarqueeSelection selection={selection}>
			<DetailsList
				items={items}
				compact={false}
				columns={getColumns()}
				selectionMode={SelectionMode.multiple}
				getKey={item => item._id}
				setKey="set"
				layoutMode={DetailsListLayoutMode.justified}
				isHeaderVisible={true}
				selection={selection}
				selectionPreservedOnEmptyClick={true}
				onItemInvoked={onItemInvoked}
				enterModalSelectionOnTouch={true}
				ariaLabelForSelectionColumn="Toggle selection"
				ariaLabelForSelectAllCheckbox="Toggle selection for all items"
				checkButtonAriaLabel="Row checkbox"
			/>
			</MarqueeSelection>
		</Fabric>
	);
};

function mapStateToProps(state) {
	return {
		items: state.RecordState.items,
	};
}

export default connect(mapStateToProps)(DetailedList);
