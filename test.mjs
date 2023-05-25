import {
	generateField,
	generateSpecField
} from './index.js'
import {convertConfig} from "./utils/index.js";

let config = [
	{
		collection: {
			name: "test"
		} ,
		fields: {
			id: generateField.genPrimaryKey() ,
			title: generateField.genNormal() ,
			content: generateSpecField.textArea()
		}
	},
	{
		collection: {
			name: "test2"
		} ,
		fields: {
			id: generateField.genPrimaryKey() ,
			title: generateField.genNormal() ,
			content: generateSpecField.textArea(),
			related: generateField.generateM2m("test","junction_test",{},{
				field_left: "test2_id",
				field_right: "test_id",
				fields_data: {
					title: generateField.genNormal() ,
					url: generateField.genNormal() ,
				}
			}),
			field_m2o: generateField.generateM2o("test",{
				field_o2m: {
					create: true ,
					field_name: "test2_list" ,
				} ,
			})
		}
	}
]


const main = () =>{
	let {collections} = convertConfig(config , [])
	console.log(JSON.stringify(collections, null , 4))
}

main()


