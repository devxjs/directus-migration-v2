import {
	generateField,
	generateSpecField
} from './index.js'
import {convertConfig} from "./utils/index.js";

const config = [
	{
		collection: {
			name: "System",
		},
	},
	{
		collection: {
			name: "provinces",
			meta: {
				group: "System"
			}
		},
		fields: {
			id: generateField.genPrimaryKey(),
			source_id: generateField.genNormal(),
			name: generateField.genNormal(),
			parent_id: generateField.generateM2o("provinces", {
				field_o2m: {
					create: true,
					field_name: "districts",
				},
			}),
			user_updated: generateSpecField.dateUpdated(),
			date_created: generateSpecField.dateCreated(),
			date_updated: generateSpecField.dateUpdated(),
		}
	},
	{
		collection: {
			name: "areas",
			meta: {
				group: "System"
			}
		},
		fields: {
			id: generateField.genPrimaryKey(),
			source_id: generateField.genNormal(),
			name: generateField.genNormal(),
			parent_id: generateField.generateM2o("zone", {
				field_o2m: {
					create: true,
					field_name: "areas",
				},
			}),
			user_updated: generateSpecField.dateUpdated(),
			date_created: generateSpecField.dateCreated(),
			date_updated: generateSpecField.dateUpdated(),
		}
	},
	{
		collection: {
			name: "route",
			meta: {
				group: "System"
			}
		},
		fields: {
			id: generateField.genPrimaryKey(),
			source_id: generateField.genNormal(),
			name: generateField.genNormal(),
			user_updated: generateSpecField.dateUpdated(),
			date_created: generateSpecField.dateCreated(),
			date_updated: generateSpecField.dateUpdated(),
		}
	},
	{
		collection: {
			name: "banks",
			meta: {
				group: "System"
			}
		},
		fields: {
			id: generateField.genPrimaryKey(),
			source_id: generateField.genNormal(),
			short_name: generateField.genNormal(),
			name: generateField.genNormal(),
			user_updated: generateSpecField.dateUpdated(),
			date_created: generateSpecField.dateCreated(),
			date_updated: generateSpecField.dateUpdated(),
		}
	},
]


const main = () =>{
	let {collections} = convertConfig(config , [])
	console.log(JSON.stringify(collections, null , 4))
}

main()


