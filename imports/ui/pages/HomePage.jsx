import React from 'react';
import { Meteor } from 'meteor/meteor';
import { connect } from 'react-redux';
import { setSelected } from '../../actions';
import { Fabric, MarqueeSelection, DetailsList, Selection, SelectionMode, DetailsListLayoutMode } from 'office-ui-fabric-react';

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.selection = new Selection({
			onSelectionChanged: () => {
			  this.props.setSelected(this.selection.getItems());
			}
		  });
		this.state = {
			columns: this.getColumns(),
		};
		this.onItemInvoked = this.onItemInvoked.bind(this);
	}

	onItemInvoked(e) {
		console.log("Item invoked:", e);
	}

	getColumns() {
		const { RECORD_TEMPLATE } = Meteor.settings.public;
		if (!RECORD_TEMPLATE) {
			return [];
		}
		return RECORD_TEMPLATE.map(column => {
			if (column.type === 'people') {
				return {
					key: column.field,
					name: column.display_name,
					// minWidth: 210,
					// maxWidth: 350,
					isRowHeader: true,
					isResizable: true,
					// isSorted: true,
					// isSortedDescending: false,
					// sortAscendingAriaLabel: 'Sorted A to Z',
					// sortDescendingAriaLabel: 'Sorted Z to A',
					// onColumnClick: this._onColumnClick,
					isPadded: true,
					onRender: ({people}) => {
						return (
							<div>
								{people.map(person => <div>{`${person.first_name} ${person.last_name}`}</div>)}
							</div>
						);
					}
				};
			}
			return {
				key: column.field,
				name: column.display_name,
				// minWidth: 210,
				// maxWidth: 350,
				isRowHeader: true,
				isResizable: true,
				// isSorted: true,
				// isSortedDescending: false,
				// sortAscendingAriaLabel: 'Sorted A to Z',
				// sortDescendingAriaLabel: 'Sorted Z to A',
				// onColumnClick: this._onColumnClick,
				isPadded: true,
				onRender: (item) => {
					return (
						<div>
							{item[column.field]}
						</div>
					);
				}
			};
		});
	}

	render() {
		return (
			<Fabric>
				<MarqueeSelection selection={this.selection}>
					<DetailsList
						items={this.props.items}
						compact={false}
						columns={this.state.columns}
						selectionMode={SelectionMode.multiple}
						getKey={item => item._id}
						setKey="set"
						layoutMode={DetailsListLayoutMode.justified}
						isHeaderVisible={true}
						selection={this.selection}
						selectionPreservedOnEmptyClick={true}
						onItemInvoked={this.onItemInvoked}
						enterModalSelectionOnTouch={true}
						ariaLabelForSelectionColumn="Toggle selection"
						ariaLabelForSelectAllCheckbox="Toggle selection for all items"
						checkButtonAriaLabel="Row checkbox"
					/>
				</MarqueeSelection>
			</Fabric>
		);
	}
}

function mapStateToProps(state) {
	return {
		items: state.RecordState.items,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		setSelected: items => dispatch(setSelected(items)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
