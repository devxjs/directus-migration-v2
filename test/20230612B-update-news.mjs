import {
	generateField ,
	generateSpecField ,
	upUpdateKnex ,
	downUpdateKnex
} from 'directus-migration-v2'

let config = [
	{
		collection: {
			name: "news",
		} ,
		fields: {
			banner: generateSpecField.image(),
			// tags: generateField.generateM2m("tags","news_tags", {},{
			// 	field_left: "news_id",
			// 	field_right: "tags_id",
			// 	fields_data: {
			// 		sort: generateField.genNormal('integer')
			// 	}
			// })
			product_tags: generateField.generateM2m("product_tags","junction_product_tags",{
				field_left: "news_id",
				field_right: "product_tags_id",
				fields_data: {
					title: generateField.genNormal(),
					content: generateSpecField.wysiwyg()
				}
			}),
			translations: generateSpecField.translations("languages","news_translations",{
				field_left: "news_id",
				field_right: "languages_code",
				fields_data: {
					title: generateField.genNormal(),
					content: generateSpecField.wysiwyg()
				}
			})
		}
	},
	{
		collection :{
			name: "tags",
		},
		fields: {
			// id: generateField.genPrimaryKey(),
			// sort: generateSpecField.sort(),
			// date_created: generateSpecField.dateCreated(),
			// date_updated: generateSpecField.dateUpdated(),
			content: generateSpecField.wysiwyg()
		}
	},
	{
		collection :{
			name: "product_tags",
			auto_sort: true
		},
		fields: {
			id: generateField.genPrimaryKey(),
			sort: generateSpecField.sort(),
			date_created: generateSpecField.dateCreated(),
			date_updated: generateSpecField.dateUpdated(),
			content: generateSpecField.wysiwyg(),
			seo_detail: generateField.generateM2o("seo_details",{
				field_o2m: {
					create: true,
					field_name: "product_tags_seo"
				}
			}),
			seo_m2m: generateField.generateM2m("seo_details","junction_product_tags_seo",{
				field_left: "product_tags_id",
				field_right: "seo_id",
				fields_data: {
					title: generateField.genNormal(),
					content: generateSpecField.wysiwyg()
				}
			})
		}
	},
]

export async function up(knex) {
	return upUpdateKnex(knex , config)
}

export async function down(knex) {
	return downUpdateKnex(knex , config)
}