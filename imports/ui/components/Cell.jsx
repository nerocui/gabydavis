import React from 'react';

const Cell = ({record}) => {
	return (
		<span className={record.valid?'element--preview__cell':'element--preview__cell red'}>
			{record.value}
		</span>
	);
};

export default Cell;
