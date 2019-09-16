import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Meteor } from 'meteor/meteor';
import {
	Selection,
	HoverCard,
	HoverCardType,
	PersonaInitialsColor,
	Persona,
	PersonaSize,
	Text,
	Calendar, DayOfWeek, DateRangeType,
} from 'office-ui-fabric-react';
import Map from '../ui/components/Map';
import Note from '../ui/components/Note';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import MapIcon from '@material-ui/icons/Map';

const useStyles = makeStyles(theme => ({
	root: {
	  display: 'flex',
	  justifyContent: 'center',
	  flexWrap: 'wrap',
	},
	chip: {
	  margin: theme.spacing(1),
	},
}));

const DayPickerStrings = {
	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	goToToday: 'Go to today',
	weekNumberFormatString: 'Week number {0}',
	prevMonthAriaLabel: 'Previous month',
	nextMonthAriaLabel: 'Next month',
	prevYearAriaLabel: 'Previous year',
	nextYearAriaLabel: 'Next year',
	prevYearRangeAriaLabel: 'Previous year range',
	nextYearRangeAriaLabel: 'Next year range',
	closeButtonAriaLabel: 'Close'
};


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

function isValidDate(d) {
	return d instanceof Date && !isNaN(d);
}

function onRenderCalendar(item) {
	if (!isValidDate(item)) {
		return '';
	}
	const [date, setDate] = React.useState(item);

	const onSelection = () => {
		setDate(item);
	}

	return (
		<div className="component--calendar__container">
			<Calendar
				onSelectDate={onSelection}
				isMonthPickerVisible={false}
				dateRangeType={DateRangeType.Day}
				value={date}
				firstDayOfWeek={DayOfWeek.Sunday}
				showGoToToday={false}
				strings={DayPickerStrings}
				isDayPickerVisible={true}
				showWeekNumbers={true}
			/>
		</div>
	)
}

function getMinWidth(column) {
	switch (column.type) {
		case 'date':
			return 240;
		case 'note':
			return 100;
		default:
			if (column.field === 'file_number' || column.field === 'child_id') {
				return 70;
			}
			return 150;
	}
}

export function getColumns() {
	const { RECORD_TEMPLATE } = Meteor.settings.public;
	if (!RECORD_TEMPLATE) {
		return [];
	}
	const classes = useStyles();
	return RECORD_TEMPLATE.map(column => {
		return {
			key: column.field,
			name: column.display_name,
			minWidth: getMinWidth(column),
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
						return onRenderCalendar(new Date(item[column.field]));
					case 'note':
						return (
							<Note value={item[column.field]}/>
						);
					default:
						if (column.field === 'street_address') {
							const plainCardProps = {
								onRenderPlainCard: onRenderPlainCard,
								renderData: item
							};
							return (
								<HoverCard plainCardProps={plainCardProps} instantOpenOnClick={true} type={HoverCardType.plain}>
									{item['street_address'] && item['street_address'] !== '' ?
										(
											<Chip
												icon={<MapIcon/>}
												label={item[column.field]}
												color="primary"
												className={classes.chip}
											/>
										):''
									}
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

