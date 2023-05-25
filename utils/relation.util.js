export const relationM2o = (many_collection , field , related_collection , related_collection_primary , options) => {
	return {
		collection: many_collection ,
		field ,
		related_collection ,
		schema: {
			"table": many_collection ,
			"column": field ,
			"foreign_key_table": related_collection ,
			"foreign_key_column": related_collection_primary ,
			"constraint_name": `${many_collection}_${field}_foreign` ,
			"on_update": "RESTRICT" ,
			"on_delete": "SET NULL" ,
			...options?.schema
		} ,
		meta: {
			many_collection ,
			"many_field": field ,
			"one_collection": related_collection ,
			"one_field": null ,
			"one_collection_field": null ,
			"one_allowed_collections": null ,
			"junction_field": null ,
			"sort_field": null ,
			"one_deselect_action": "nullify" ,
			...options?.meta
		}
	}
}

export const relationO2m = (one_collection , one_field , many_collection , many_field , one_collection_primary_field , options) => {
	return {
		collection: many_collection ,
		field: many_field ,
		related_collection: one_collection ,
		schema: {
			"table": many_collection ,
			"column": many_field ,
			"foreign_key_table": one_collection ,
			"foreign_key_column": one_collection_primary_field ,
			"constraint_name": `${many_collection}_${many_field}_foreign` ,
			"on_update": "RESTRICT" ,
			"on_delete": "SET NULL" ,
			...options?.schema
		} ,
		meta: {
			many_collection ,
			many_field ,
			one_collection ,
			one_field ,
			"one_collection_field": null ,
			"one_allowed_collections": null ,
			"junction_field": null ,
			"sort_field": null ,
			"one_deselect_action": "nullify" ,
			...options?.meta
		}
	}
}

export const relationM2m = (collectionTemp , one_field , left , right) => {
	return [
		{
			collection: collectionTemp ,
			field: right.field ,
			"related_collection": right.collection ,
			"meta": {
				"one_field": null ,
				"sort_field": null ,
				"one_deselect_action": "nullify" ,
				"junction_field": left.field
			} ,
			"schema": {
				on_update: "RESTRICT" ,
				on_delete: "CASCADE"
			}
		} ,
		{
			collection: collectionTemp ,
			"field": left.field ,
			"related_collection": left.collection ,
			"meta": {
				one_field ,
				"sort_field": null ,
				"one_deselect_action": "nullify" ,
				"junction_field": right.field
			} ,
			"schema": {
				on_update: "RESTRICT" ,
				on_delete: "CASCADE"
			}
		}
	]
}