import {MigrationClass} from "./services/index.js"
import {fields_directus} from "./utils/index.js";
import * as utils from "./utils/index.js";

//export * from "./helpers/v1.migration.js"

export * from "./utils/index.js"

export const generateField = {
	genSpecField: fields_directus ,
	genPrimaryKey: (type = "integer" , options) => utils.fieldPrimaryKey(type , options) ,
	genNormal: (type = "string" , options) => utils.fieldNormal(type , options) ,
	generateM2o: (related_collection , options) => utils.fieldM2o(related_collection , {
		field_o2m: {
			create: options?.field_o2m?.create || false ,
			field_name: options?.field_o2m?.field_name || false ,
		} ,
		meta: options?.meta || {} ,
		schema: options?.schema || {}
	}) ,
	generateM2m: (related_collection , temp_collection , options , fields_extend) => utils.fieldM2m(related_collection , temp_collection , {
		meta: options?.meta || {} ,
		schema: options?.schema || {}
	} , fields_extend) ,
	generateO2m: (related_collection , related_field , options) => utils.fieldO2m(related_collection , related_field , {
		meta: options?.meta || {} ,
		schema: options?.schema || {}
	}) ,

}


export const generateSpecField = generateField.genSpecField
export const upCreateKnex = async (knex , config) => {
	const migrationClass = new MigrationClass(knex)
	return migrationClass.upCreateKnex(knex , config)
}

export const downCreateKnex = async (knex , config) => {
	const migrationClass = new MigrationClass(knex)
	return migrationClass.downCreateKnex(knex , config)
}
export const upUpdateKnex = async (knex , config) => {
	const migrationClass = new MigrationClass(knex)
	return migrationClass.upUpdateKnex(knex , config)
}
export const downUpdateKnex = async (knex , config) => {
	const migrationClass = new MigrationClass(knex)
	return migrationClass.downUpdateKnex(knex , config)
}