import {
	generateField ,
	generateSpecField ,
	upCreateKnex ,
	downCreateKnex
} from 'directus-migration-v2'

let config = [
	{
		collection: {
			name: "news",
			auto_sort: true
		} ,
		fields: {
			id: generateField.genPrimaryKey(),
			sort: generateSpecField.sort(),
			date_created: generateSpecField.dateCreated(),
			date_updated: generateSpecField.dateUpdated(),
			thumbnail: generateSpecField.image(),
			tags: generateField.generateM2m("tags", "news_tags",{
				field_left: "news_id",
				field_right: "tags_id",
				fields_data: {
					sort: generateField.genNormal('integer')
				}
			})

		}
	},
	{
		collection :{
			name: "tags",
			auto_sort: true
		},
		fields: {
			id: generateField.genPrimaryKey(),
			sort: generateSpecField.sort(),
			date_created: generateSpecField.dateCreated(),
			date_updated: generateSpecField.dateUpdated(),
			title: generateField.genNormal(),
		}
	},
]

export async function up(knex) {
	return upCreateKnex(knex , config)
}

export async function down(knex) {
	return downCreateKnex(knex , config)
}