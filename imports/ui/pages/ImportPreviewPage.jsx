import React from 'react';
import { connect } from 'react-redux';
import { Stack } from 'office-ui-fabric-react';

const ImportPreviewPage = ({records}) => {
	const renderRow = record => {
		const cells = [];
		for (const key in record) {
			cells.push(record[key]);
		}
		return (
			<React.Fragment>
				{cells.map(cell => {
					console.log(cell);
					return (<span className="element--preview__cell">hello</span>);
				})}
			</React.Fragment>
		);
	};

	return (
		<Stack>
			{records.map(record => {
				return (
					<Stack horizontal>
						{renderRow(record)}
					</Stack>
				);
			})}
		</Stack>
	);
};

function mapStateToProps(state) {
	return {
		records: state.RecordState.importedItems,
	};
}

export default connect(mapStateToProps)(ImportPreviewPage);
