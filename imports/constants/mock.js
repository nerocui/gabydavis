const grid = [
	[
		{
			id: "fh29g",
			value: "John",
			valid: true,
			parsedHeader: {
				id: "fh29g",
				value: "first_name",
				valid: true,
				redommended: [],
			},
			originalValue: "john",
			parser: () => console.log("parsed"),
		},
		{
			id: "0u82ry3",
			value: "Doe",
			valid: true,
			parsedHeader: {
				id: "0u82ry3",
				value: "last_name",
				valid: true,
				recommended: [],
			},
			originalValue: "doe",
			parser: () => console.log("parsed"),
		},
		{
			id: "wertyj",
			value: ""
		}
	],
];

export grid;
