import React from "react";
import { Meteor } from 'meteor/meteor';
import {
	Selection,
	HoverCard,
	HoverCardType,
	PersonaInitialsColor,
	Persona,
	PersonaSize,
	Text,
} from 'office-ui-fabric-react';
import Map from '../ui/components/Map';

function onRenderPlainCard(item) {
	const boundary = {
		search: `${item.street_address}, ${item.city}, ${item.postal_code}`,
		option: {
			entityType: "PopulatedPlace"
		},
		polygonStyle: {
			fillColor: "rgba(255, 255, 255, 0)",
			strokeColor: "#a495b2",
			strokeThickness: 2
		}
	};
	return (
		<div className="bingmap">
			<Map boundary={boundary}/>
		</div>
	);
}

export function getColumns() {
	const { RECORD_TEMPLATE } = Meteor.settings.public;
	if (!RECORD_TEMPLATE) {
		return [];
	}
	return RECORD_TEMPLATE.map(column => {
		return {
			key: column.field,
			name: column.display_name,
			minWidth: 150,
			maxWidth: 200,
			isRowHeader: true,
			isResizable: true,
			// isSorted: true,
			// isSortedDescending: false,
			// sortAscendingAriaLabel: 'Sorted A to Z',
			// sortDescendingAriaLabel: 'Sorted Z to A',
			// onColumnClick: this._onColumnClick,
			isPadded: true,
			onRender: (item) => {
				switch (column.type) {
					case 'people':
						console.log('rendering people');
						
						return (
							<div>
								{item.people.map(person => {
									const personaData = {
										secondaryText: person.role,
									};
									const personaWithInitials = {
										...personaData,
										text: `${person.first_name} ${person.last_name || ''}`,
										imageInitials: `${person.first_name.charAt(0)}${person.last_name?person.last_name.charAt(0):''}`
									};
									return (
										<div className="persona">
											<Persona
												{...personaWithInitials}
												initialsColor={PersonaInitialsColor.blue}
												size={PersonaSize.size40}
											/>
										</div>
									);
								})}
							</div>
						);
					case 'date':
						return (
							<div>{new Date(item[column.field]).toDateString()}</div>
						);
					default:
						if (column.field === 'street_address') {
							const plainCardProps = {
								onRenderPlainCard: onRenderPlainCard,
								renderData: item
							};
							console.log('rendering street address');
							return (
								<HoverCard plainCardProps={plainCardProps} instantOpenOnClick={true} type={HoverCardType.plain}>
									{item[column.field]}
								</HoverCard>
							);
						}
						if (column.field === 'other_notes') {
							return (
								<Text block>
									{item[column.field]}
								</Text>
							);
						}
						return (
							<div>
								{item[column.field]}
							</div>
						);
				}
				
			}
		};
	});
}

