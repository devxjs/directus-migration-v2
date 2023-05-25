export const collectionTempM2M = (collection_temp,options) =>{

	return {
		collection: collection_temp,
		meta: {
			"hidden": true,
			"icon": "import_export",
			...(options?.meta || {})
		},
		schema: {
			name: collection_temp,
			...(options?.schema || {})
		},
		fields: []
	}
}