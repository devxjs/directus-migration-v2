import * as utils from '../utils/index.js'
import {SchemaService} from "./schema.service.js";
import {convertConfig , fields_directus , filterFieldsToCreate} from "../utils/index.js";


export class MigrationClass {
	collections = []
	relations = []

	constructor(knex) {
		this.schemaClass = new SchemaService(knex)
		this.generateField = {
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

	}

	async getDataAndConvert(knex , config , options) {
		let data_directus = await this.loadDataDirectus(knex)
		let {collections , relations , update} = convertConfig(config , data_directus , options)

		return {collections , relations , update , data_directus}
	}

	async loadDataDirectus() {
		return Promise.all([
			this.schemaClass.readAll("collection") ,
			this.schemaClass.readAll("field") ,
			this.schemaClass.readAll("relation")
		]).then(data => {


			return {
				collections: data[0] ,
				fields: data[1] ,
				relations: data[2]
			}
		}).catch(e => {
			console.log("Err loadDataDirectus: " , e)
		})
	}

	async upCreateKnex(knex , config) {
		try {
			let {collections , relations , update} = await this.getDataAndConvert(knex , config)

			if (!collections) throw new Error("[!]----[Error]: upCreateKnex -> collections not found")

			return this.schemaClass.createMany("collection" , collections).then(async () => {
				await this.schemaClass.createMany("relation" , relations)
				if (update) {
					if (update.relations && update.relations.length > 0) {
						await this.schemaClass.updateMany("relation" , update.relations)
					}

					if (update.fields && update.fields.length > 0) {
						await this.schemaClass.createMany("field" , update.fields)
					}
				}
			})
		} catch (e) {
			console.log('Err upCreateKnex:' , e)
		}
	}

	async downCreateKnex(knex , config) {
		await this.setCheckForeignKey(false , knex)
		let {collections , relations , update} = await this.getDataAndConvert(knex , config , {
			mode: "down"
		})

		let fieldsDown = collections.reduce((pre , current) => {
			return [
				...pre ,
				...current.fields.filter(item => item?.schema?.is_primary_key !== true)
			]
		} , [])

		if (update.fields && update.fields.length > 0) {
			fieldsDown = [
				...fieldsDown ,
				...update.fields.filter(item => item?.schema?.is_primary_key !== true)
			]
		}

		console.log("CollectionsDown: " , collections)
		console.log("FieldsDown: " , fieldsDown)


		return this.schemaClass.deleteMany("relation" , relations)
			.then(async () => this.schemaClass.deleteMany("field" , fieldsDown))
			.then(async () => this.schemaClass.deleteMany("collection" , collections))
			.then(async () => this.setCheckForeignKey(true , knex))
	}

	async upUpdateKnex(knex , config) {
		try {
			let {collections , data_directus , relations , update} = await this.getDataAndConvert(knex , config)

			let fields_create = filterFieldsToCreate(collections , data_directus , false)

			let collectionsCreated = collections.filter(collection => !data_directus.collections.map(item => item.collection).includes(collection.collection))

			fields_create = fields_create.filter(item => !collectionsCreated.map(ite => ite.collection).includes(item.collection))

			console.log("collectionsUp: " , collectionsCreated)
			console.log("fieldsUp: " , fields_create)
			console.log("relationsUp: " , relations)
			// relations = relations.filter(item => [
			// 	...fields_create ,
			// 	//...fields_update
			// ].some(ite => ite.collection === item.collection && ite.field === item.field))

			if (!fields_create) throw new Error("[!]----[Error]: upUpdateKnex -> fields_create not found")

			return this.schemaClass.createMany("collection" , collectionsCreated)
				.then(async () => {

					if (fields_create.length) {
						await this.schemaClass.createMany("field",fields_create)
					}

					if (relations.length) {
						await this.schemaClass.createMany('relation',relations)
					}

					if (update) {
						if (update.relations && update.relations.length > 0) {
							await this.schemaClass.updateMany('relation',update.relations)
						}
						if (update.fields && update.fields.length > 0) {
							await this.schemaClass.createMany('field',update.fields)
						}
					}
				})

		} catch (e) {
			console.log('Err upUpdateKnex:' , e)

		}
	}

	async downUpdateKnex(knex , config) {
		await this.setCheckForeignKey(false , knex)

		let {collections , update , data_directus} = await this.getDataAndConvert(knex , config , {
			mode: "down"
		})
		let fields_create = filterFieldsToCreate(collections , data_directus , false)


		let collectionsName = fields_create.filter(item => item?.schema?.is_primary_key).map(item => item.collection)
		let collectionsDown = collections.filter(item => collectionsName.includes(item.collection))

		fields_create = fields_create.filter(item => !collectionsDown.map(ite => ite.collection).includes(item.collection))

		console.log("collectionsDown: " , collectionsDown)


		let fieldsDown = [...fields_create , ...collectionsDown.reduce((pre , current) => {
			return [
				...pre ,
				...current.fields.filter(item => item?.schema?.is_primary_key !== true)
			]
		} , [])]

		console.log("fieldsDown: " , fieldsDown)

		if (update) {
			if (update.fields && update.fields.length > 0) {
				fieldsDown = [
					...fieldsDown ,
					...update.fields
				]
			}
		}


		return this.schemaClass.deleteMany('field',fieldsDown)
			.then(async () => this.schemaClass.deleteMany('collection',collectionsDown))
			.then(async () => this.setCheckForeignKey(true , knex))

	}


	async setCheckForeignKey(key , knex) {
		return knex.raw(`SET FOREIGN_KEY_CHECKS = ${!!key ? 1 : 0};`).catch(e => {
			console.log("Error setCheckForeignKey: " , e)
		})
	}


}