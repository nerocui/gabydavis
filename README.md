[![CircleCI](https://circleci.com/gh/nerocui/gabydavis.svg?style=svg)](https://circleci.com/gh/nerocui/gabydavis)
# Gaby Davis Foundation
This is a CRM for the Gaby Davis Foundation. The main purpose of this project is to help the Foundation to manage information about the families they helped. Gaby Davis Foundation currently use an Excel file for managing the records. This is not very efficient in a number of ways. The records are not easily searchable, and sharing admin access of the records becomes hard.

This solution focus on solving this issue in a number of ways.
### Searching
Everytime a record is entered into the database, the same record will also be pushed to Algolia to be indexed. When the user search for anything that's included in the records, the correct result will show up.

### Importing/Exporting
The Foundation already has a lot of data in the Excel file. The best and only way to transition to our solution is through importing. We wrote a number of parsers suited for each type of data in the spread sheet. User can just drag and drop their file in, as long as it's in the expected format, the data will all be imported into the database and pushed to algolia.

We also have plan to implement an export feature for the situation of the organization no longer want to use this solution. 

### Map
Gaby Davis Foundation requested to have a Map feature to show the address of the families. This solution chose Bing Map for this feature. A map will be shown if the user hover over or click the families address. The same map will also be shown if the user click into the records' detail page. The reason why not all maps are always shown on the overview page is that each call to the map api counts toward the api quota.

### Configuration
We realize that the number/type of column may not stay forever same. Also other organization might want to adopt this software and customize for their needs. So the columns are configuration based. We define them in the settings.json file like shown in the template below, and the data renderer and parser will just do the job accordingly.

One of the limitation is that the parsers themselves are hard coded in this project. Meaning if we have a new format of data that we didn't anticipate, the parser will be confused. The best solution is, of course, to make this platform completely plugin based. Each type of record will stay configurable as now, but the parsers can be customized and validated. It's definitely a direction this platform can take, but it's too much for the initial implementation.

## Instruction
To run this project, first install meteorjs.
Then create a settings.json file in the project root.
Below is a sample of the settings.json file, replace the api keys with your own.

Run 
```bash
meteor npm install && meteor --settings settings.json
```

## Settings Template
```json
{
	"public": {
		"FEATURE_FLAGS": [
			{
				"id": "USE_FIREBASE",
				"enabled": false
			},
			{
				"id": "USE_MAP",
				"enabled": true
			},
			{
				"id": "USE_PAYMENT",
				"enabled": false
			},
			{
				"id": "USE_ALGOLIA",
				"enabled": true
			}
		],
		"PERSON_TEMPLATE": [
			{
				"type": "string",
				"field": "first_name",
				"display_name": "First Name"

			},
			{
				"type": "string",
				"field": "last_name",
				"display_name": "Last Name"
			},
			{
				"type": "string",
				"field": "role",
				"disply_name": "Role"
			},
			{
				"type": "date",
				"field": "date_of_birth",
				"display_name": "Birthday"
			}
		],
		"RECORD_TEMPLATE": [
			{
				"type": "string",
				"field": "file_number",
				"display_name": "File Number"
			},
			
			{
				"type": "note",
				"field": "other_notes",
				"display_name": "Other Notes"
			},
			{
				"type": "date",
				"field": "date_helped",
				"display_name": "Date Helped"
			},
			{
				"type": "people",
				"field": "people",
				"display_name": "People"
			},
			{
				"type": "string",
				"field": "child_id",
				"display_name": "Child ID"
			},
			{
				"type": "string",
				"field": "street_address",
				"display_name": "Street Address"
			},
			{
				"type": "string",
				"field": "city",
				"display_name": "City"
			},
			{
				"type": "string",
				"field": "postal_code",
				"display_name": "Postal Code"
			},
			{
				"type": "string",
				"field": "phone_number",
				"display_name": "Phone Number"
			},
			{
				"type": "string",
				"field": "cell_phone_number",
				"display_name": "Cell Phone Number"
			},
			{
				"type": "string",
				"field": "email",
				"display_name": "Email"
			},
			{
				"type": "string",
				"field": "cancer_type",
				"display_name": "Cancer Type"
			},
			{
				"type": "date",
				"field": "diagnosis_date",
				"display_name": "Disgnosis Date"
			},
			{
				"type": "number",
				"field": "length_of_treatment",
				"display_name": "Length of Treatment"
			},
			{
				"type": "note",
				"field": "treatment_notes",
				"display_name": "Treatment Notes"
			},
			{
				"type": "boolean",
				"field": "relapse",
				"display_name": "Relapse"
			},
			{
				"type": "date",
				"field": "date_of_relapse",
				"display_name": "Date of Relapse"
			},
			{
				"type": "date",
				"field": "date_of_application",
				"display_name": "Date of Application"
			},
			{
				"type": "date",
				"field": "date_of_visit",
				"display_name": "Date of Visit"
			},
			{
				"type": "string",
				"field": "location_of_visit",
				"display_name": "Location of Visit"
			},
			{
				"type": "string",
				"field": "social_worker",
				"display_name": "Social Worker"
			},
			{
				"type": "date",
				"field": "heaven_date",
				"display_name": "Heaven Date"
			}
		]
	},
	"email": "admin email",
	"username": "admin username",
	"password": "admin password",
	"first_name": "admin first name",
	"last_name": "admin last name",
	"apis": [
		{
			"id": "BING_MAP",
			"value": "Bing Map API Key"
		},
		{
			"id": "ALGOLIA",
			"value": {
				"algoliaApplicationID": "Algolia Application ID",
				"algoliaSearchKey": "Algolia Search Key",
				"algoliaAdminKey": "Algolia Admin Key"
			}
		}
	]
}
```
