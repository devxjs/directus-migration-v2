import {RelationsService , CollectionsService , FieldsService} from '@directus/api'
import {getSchema} from "@directus/api/utils/get-schema"

export class SchemaService {

	constructor(knex) {
		this.knex = knex
		this.keys_primary = {
			collection: "collection" ,
			field: "id" ,
			relation: "id"
		}

	}

	async load(type) {

		let schema = await getSchema({
			database: this.knex ,
			bypassCache: true
		})

		switch (type) {
			case 'collection':
				this.service =  new CollectionsService({
					knex: this.knex ,
					schema
				})
				break
			case "field":
				this.service =   new FieldsService({
					knex: this.knex ,
					schema
				})
				break

			case "relation":
				this.service =   new RelationsService({
					knex: this.knex ,
					schema
				})
				break
		}

		return this.service

	}


	async readAll(type) {
		return this.load(type).then(async (service) => {
			switch (type) {
				case 'collection':
					return service.readByQuery({limit: -1})
				case "field":
				case "relation":
					return service.readAll()
			}
		}).catch(e => {
			console.log(`Error readAll [${type}]: ` , e)
		})
	}

	async createOne(type , data) {
		return this.load(type).then(async (service) => {


			switch (type) {
				case "collection":
					await service.createOne(data)
					console.log(`Created collection: [${data.collection}]`)
					break;
				case "field":
					await service.createField(data.collection,data)
					console.log(`Created field: ${data.field} [${data.collection}]`)
					break;
				case "relation":
					await service.createOne(data)
					console.log(`Created relation: [${data.collection}] -> ${data.field} <- [${data.related_collection}]`)
					break;
			}

		}).catch(e => {
			console.log(`Error createOne [${type}]: ` , e)
			console.log(JSON.stringify(data , null , 4))
		})
	}

	async createMany(type , data) {
		for (let item of data) {
			try {
				await this.createOne(type , item)
			} catch (e) {
				console.log(`Error createMany [${type}]: ` , e)
			}
		}
	}

	async updateOne(type , data) {
		return this.load(type).then(async (service) => {
			switch (type) {
				case "collection":
					await service.updateOne(data.collection , data)
					console.log(`Updated collection: [${data.collection}]`)
					break;
				case "field":
					await service.updateField(data.collection , data)
					console.log(`Updated field: ${data.field} [${data.collection}]`)
					break;
				case "relation":
					await service.updateOne(data.collection , data.field , data)
					console.log(`Updated relation: [${data.collection}] -> ${data.field} <- [${data.related_collection}]`)
					break;
			}

		}).catch(e => {
			console.log(`Error updateOne ${type}: ` , e)
		})
	}

	async updateMany(type , data) {
		for (let item of data) {
			try {
				await this.updateOne(type , item)
			} catch (e) {
				console.log(`Error updateMany -> Item: [${type}] -> [${item}]` , e)
			}
		}
	}


	async deleteOne(type , data) {
		return this.load(type).then(async (service) => {
			switch (type) {
				case "collection":
					await service.deleteOne(data[this.keys_primary[type]])
					console.log(`Deleted collection: [${data[this.keys_primary[type]]}]`)
					break;
				case "field":
					await service.deleteField(data.collection , data.field)
					console.log(`Deleted field: ${data.field} [${data.collection}]`)
					break;
				case "relation":
					await service.deleteOne(data.collection , data.field)
					console.log(`Deleted relation: [${data.collection}] -> ${data.field} <- [${data.related_collection}]`)
					break;
			}

		}).catch(e => {
			console.log(`Error deleteOne [${type}]: ` , e)
			console.log(JSON.stringify(data , null , 4))

		})
	}

	async deleteMany(type , delete_data) {

		switch (type) {
			case "collection":
				let stop = true
				let arrData = []
				const updateKey = async (delete_data) => {
					let data = await this.readAll(type)
					let data_filter = data.filter(item => item.collection.indexOf("directus_") !== 0)

					if (delete_data) {
						arrData = data_filter.filter(item => delete_data.map(ite => ite.collection).includes(item.collection))
					} else {
						arrData = data_filter
					}

					if (arrData.length === 0) stop = false

				}

				await updateKey(delete_data)

				while (arrData.length > 0 && stop) {
					for (let item of arrData) {
						try {
							await this.deleteOne(type , item)
						} catch (e) {
							//console.log(e.message)
						}
						await updateKey(delete_data)
						if (!stop) break
					}
				}
				break;
			case "field":
				for (let field of delete_data) {
					try {
						await this.deleteOne("field" , field)
					} catch (e) {
						console.log(`Error deleteMany: [${type}]` , e)
					}
				}
				break;
			case "relation":
				for (let field of delete_data) {
					try {
						await this.deleteOne("relation" , field)
					} catch (e) {
						console.log(`Error deleteMany: [${type}]` , e)
					}
				}
				break;
		}


	}


}