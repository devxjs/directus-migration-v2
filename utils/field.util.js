import {field_meta,field_schema} from '../data/field.data.js'


export const fields_directus = {
	sort: (options) => ({
		//"field": "sort" ,
		"type": "integer" ,
		"meta": {
			"interface": "input" ,
			"hidden": true ,
			...(options?.meta || {})
		} ,
		"schema": {
			...(options?.schema || {})
		}
	}) ,

	status: (options) => ({
		//"field": "status" ,
		"type": "string" ,
		"meta": {
			"width": "full" ,
			"options": {
				"choices": [
					{
						"text": "$t:published" ,
						"value": "published"
					} ,
					{
						"text": "$t:draft" ,
						"value": "draft"
					} ,
					{
						"text": "$t:archived" ,
						"value": "archived"
					}
				]
			} ,
			"interface": "select-dropdown" ,
			"display": "labels" ,
			"display_options": {
				"showAsDot": true ,
				"choices": [
					{
						"text": "$t:published" ,
						"value": "published" ,
						"foreground": "#FFFFFF" ,
						"background": "var(--primary)"
					} ,
					{
						"text": "$t:draft" ,
						"value": "draft" ,
						"foreground": "#18222F" ,
						"background": "#D3DAE4"
					} ,
					{
						"text": "$t:archived" ,
						"value": "archived" ,
						"foreground": "#FFFFFF" ,
						"background": "var(--warning)"
					}
				]
			} ,
			...(options?.meta || {})
		} ,
		"schema": {
			"is_nullable": false ,
			"default_value": "published" ,
			...(options?.schema || {})
		}
	}) ,

	userCreated: (options) => fieldM2o("directus_users" , {
		meta: {
			"special": [
				"user-created"
			] ,
			"interface": "select-dropdown-m2o" ,
			"options": {
				"template": "{{avatar.$thumbnail}} {{first_name}} {{last_name}}"
			} ,
			"display": "user" ,
			"readonly": true ,
			"hidden": true ,
			"width": "half" ,
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		}
	}) ,

	userUpdated: (options) => fieldM2o("directus_users" , {
		meta: {
			"special": [
				"user-updated"
			] ,
			"interface": "select-dropdown-m2o" ,
			"options": {
				"template": "{{avatar.$thumbnail}} {{first_name}} {{last_name}}"
			} ,
			"display": "user" ,
			"readonly": true ,
			"hidden": true ,
			"width": "half" ,
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		}
	}) ,

	dateCreated: (options) => ({
		//"field": "date_created" ,
		"type": "timestamp" ,
		"meta": {
			"special": [
				"date-created"
			] ,
			"interface": "datetime" ,
			"readonly": true ,
			"hidden": true ,
			"width": "half" ,
			"display": "datetime" ,
			"display_options": {
				"relative": true
			} ,
			...(options?.meta || {})
		} ,
		"schema": {
			...(options?.schema || {})
		}
	}) ,

	dateUpdated: (options) => ({
		//"field": "date_updated" ,
		"type": "timestamp" ,
		"meta": {
			"special": [
				"date-updated"
			] ,
			"interface": "datetime" ,
			"readonly": true ,
			"hidden": true ,
			"width": "half" ,
			"display": "datetime" ,
			"display_options": {
				"relative": true
			} ,
			...(options?.meta || {})
		} ,
		"schema": {
			...(options?.meta || {})
		}
	}) ,

	dateTime: (type, options) => fieldNormal(type ?? "dateTime" , {
		meta: {
			interface: "datetime",
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		}
	}) ,

	repeater: (options) => fieldNormal("json", {
		meta: {
			interface: "list",
			special: ["cast-json"],
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		}
	}) ,


	radioButton: (choices , options) => fieldNormal("string" , {
		meta: {
			"interface": "select-radio" ,
			"options": {
				choices
				// "choices": [
				// 	{
				// 		"text": "default",
				// 		"value": "default"
				// 	}
				// ]
			} ,
			...(options?.meta || {})
		} ,
		schema: {
			default_value: (!!choices && Array.isArray(choices) && choices.length > 0) ? choices[0].value : null ,
			...(options?.schema || {})
		}
	}) ,

	code: (type,options) => fieldNormal(type ?? "json" , {
		meta: {
			"interface": "input-code" ,
			... !type ? {special : ["cast-json"]} : {},
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		}
	}),

	image: (options) => fieldM2o("directus_files" , {
		meta: {
			interface: "file-image" ,
			special: ["file"],
			display: "image",
			...(options?.meta || {})
		} ,
		schema: {
			data_type: 'char',
			...(options?.schema || {})
		}
	}) ,

	toggle: (options) => fieldNormal("boolean" , {
		meta: {
			interface: "boolean" ,
			special: ["cast-boolean"] ,
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		}
	}) ,

	dropDown: (choices , options) => fieldNormal("string" , {
		meta: {
			"interface": "select-dropdown" ,
			"options": {
				choices
			} ,
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		}
	}) ,

	checkBoxes: (choices , options) => fieldNormal("json" , {
		meta: {
			"interface": "select-multiple-checkbox" ,
			"special": [
				"cast-json"
			] ,
			"options": {
				choices
			} ,
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		}
	}) ,

	slug: (template , options) => fieldNormal("string" , {
		meta: {
			"interface": "extension-wpslug" ,
			"special": null ,
			"options": {
				"template": `{{${template}}` ,
				//"prefix": "{{name}}",
				"update": [
					"create" ,
					"update"
				]
			} ,
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		}
	}) ,

	file: (options) => fieldM2o("directus_files" , {
		meta: {
			interface: "file-image" ,
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		}
	}) ,

	files: (temp_collection,options) => fieldM2m("directus_files" ,temp_collection, {},{
		meta: {
			interface: "files" ,
			special: ["files"] ,
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		}
	}) ,

	wysiwyg: (options) => fieldNormal("text" , {
		meta: {
			interface: "input-rich-text-html" ,
			options: {
				"toolbar": [
					"undo" ,
					"redo" ,
					"bold" ,
					"italic" ,
					"underline" ,
					"strikethrough" ,
					"subscript" ,
					"superscript" ,
					"fontselect" ,
					"fontsizeselect" ,
					"h1" ,
					"h2" ,
					"h3" ,
					"h4" ,
					"h5" ,
					"h6" ,
					"alignleft" ,
					"aligncenter" ,
					"alignright" ,
					"alignjustify" ,
					"alignnone" ,
					"indent" ,
					"outdent" ,
					"numlist" ,
					"bullist" ,
					"forecolor" ,
					"backcolor" ,
					"removeformat" ,
					"cut" ,
					"copy" ,
					"paste" ,
					"remove" ,
					"selectall" ,
					"blockquote" ,
					"customLink" ,
					"unlink" ,
					"customImage" ,
					"customMedia" ,
					"table" ,
					"hr" ,
					"code" ,
					"fullscreen" ,
					"visualaid" ,
					"ltr rtl"
				]
			} ,
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		}
	}) ,

	textArea: (options) => fieldNormal("text" , {
		meta: {
			interface: "input-multiline" ,
			...(options?.meta || {})
		} ,
		schema: {
			"data_type": "varchar" ,
			"max_length": 255 ,
			...(options?.schema || {})
		}
	}) ,

	translations: (collection_language,temp_collection, fields, options) => fieldM2m(collection_language ,temp_collection, fields, {
		meta: {
			special: ["translations"] ,
			interface: "translations",
			... (options?.meta || {})
		},
		schema: {
			... (options?.schema || {})
		}
	})
}

export const fieldNormal = (type = "string" , options) => {
	return {
		type ,
		schema: {
			...field_meta,
			...(options?.schema || {})
		} ,
		meta: {
			...field_schema,
			...(options?.meta || {})
		} ,
	}
}

export const fieldPrimaryKey = (type = "integer" , options) => {
	return fieldNormal(type === 'uuid' ? "string" : type , {
		meta: {
			hidden: type !== "string" ,
			interface: "input",
			special: type === 'uuid' ? ['uuid'] : null ,
			...(options?.meta || {})
		} ,
		schema: {
			is_primary_key: true ,
			has_auto_increment: type === 'integer' ,
			...(options?.schema || {})
		}
	})
}

export const fieldM2o = (related_collection , options , relations_options) => {
	return {
		type: "$M2O$" ,
		schema: {
			...(options?.schema || {})
		} ,
		meta: {
			"interface": "select-dropdown-m2o" ,
			"special": [
				"m2o"
			] ,
			...(options?.meta || {})
		} ,
		related_collection ,
		field_o2m: options?.field_o2m || {} ,
		relations_options
	}
}

export const fieldM2m = (related_collection , temp_collection , fields_extend, options) => {
	return {
		//type: "alias",
		type: "$M2M$" ,
		meta: {
			"interface": "list-m2m" ,
			"special": [
				"m2m"
			] ,
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		} ,
		fields_extend ,
		related_collection ,
		temp_collection

	}
}

export const fieldO2m = (related_collection , related_field , options) => {
	return {
		//type: "alias",
		type: "$O2M$" ,
		meta: {
			"interface": "list-o2m" ,
			"special": [
				"o2m"
			] ,
			...(options?.meta || {})
		} ,
		schema: {
			...(options?.schema || {})
		} ,
		related_field ,
		related_collection ,

	}
}