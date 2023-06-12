import {
	generateField ,
	generateSpecField ,
	upCreateKnex ,
	downCreateKnex
} from 'directus-migration-v2'
import {ItemsService} from "@directus/api";
import {getSchema} from "@directus/api/utils/get-schema";

let config = [
	{
		collection: {
			name: "languages",
			auto_sort: true
		} ,
		fields: {
			code: generateField.genPrimaryKey("string") ,
			name: generateField.genNormal(),
			default: generateSpecField.toggle({
				schema: {
					default_value :false
				}
			})
		}
	},
	{
		collection: {
			name: "module_seo_settings",
			auto_sort: true
		} ,
		fields: {
			key: generateField.genPrimaryKey("string") ,
			value: generateSpecField.code()
		}
	},
	{
		collection :{
			name: "module_seo_redirection",
			auto_sort: true
		},
		fields: {
			id: generateField.genPrimaryKey(),
			sort: generateSpecField.sort(),
			date_created: generateSpecField.dateCreated(),
			date_updated: generateSpecField.dateUpdated(),
			new_url: generateField.genNormal(),
			old_url: generateField.genNormal()
		}
	},
	{
		collection: {
			name: "seo_details",
			auto_sort: true,
		},
		fields: {
			id: generateField.genPrimaryKey(),
			meta_title: generateField.genNormal(),
			meta_keywords: generateSpecField.textArea(),
			meta_description: generateSpecField.textArea(),
			meta_social: generateSpecField.code(),
			meta_robots: generateSpecField.checkBoxes([
				{
					"text": "No Index",
					"value": "noindex"
				},
				{
					"text": "No follow",
					"value": "nofollow"
				},
				{
					"text": "No Archive",
					"value": "noarchive"
				},
				{
					"text": "No Image Index",
					"value": "noimageindex"
				},
				{
					"text": "No Snippet",
					"value": "nosnippet"
				}
			]),
			footer_code: generateSpecField.code("string"),
			header_code: generateSpecField.code("string"),
			schema_code: generateSpecField.code("string"),
			image_share: generateSpecField.image(),
			twitter_image: generateSpecField.image(),
			facebook_image: generateSpecField.image(),
		}
	},
	{
		collection: {
			name: "seo_advanced",
			auto_sort: true
		},
		fields:{
			collection: generateField.genPrimaryKey('string'),
			translations: generateSpecField.translations('languages',"seo_advanced_translations",{
				field_left: "seo_advanced_collection",
				field_right: "languages_code",
				fields_data: {
					seo_details: generateField.generateM2o("seo_details",{
						meta: {
							interface: "seo_analyzer",
							options: {
								isSEOAdvanced: true
							}
						}
					})
				}
			})
		}

	}
]


let itemsSeoSettings = [
	{
		key: "general" ,
		value: {
			"options": {} ,
			"seo_collections": [] ,
			"seo_collections_settings": {} ,
			"setup": true
		}
	} ,
	{
		key: "setup" ,
		value: "1"
	}
]

let itemsLanguages = [
	{
		code: "vi-VI",
		name: "Vietnamese",
		default: true
	},
	{
		code: "en-US",
		name: "English",
		default: false
	}
]

export async function up(knex) {

	await upCreateKnex(knex , config)

	let schema = await getSchema()
	let seoService = new ItemsService("module_seo_settings" , {
		schema,
		knex
	})
	let langService = new ItemsService("languages" , {
		schema,
		knex
	})

	return Promise.all([
		seoService.createMany(itemsSeoSettings),
		langService.createMany(itemsLanguages)
	])
}



export async function down(knex) {
	return downCreateKnex(knex , config)
}