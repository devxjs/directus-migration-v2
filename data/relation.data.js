export const relation_schema =  {
	//name: "category",
	//table: "news",
	//data_type: "int unsigned",
	default_value: null ,
	generation_expression: null ,
	max_length: null ,
	//numeric_precision: 10,
	//numeric_scale: 0,
	is_generated: false ,
	is_nullable: true ,
	is_unique: false ,
	is_primary_key: false ,
	has_auto_increment: false ,
	//foreign_key_column: "id",
	//foreign_key_table: "news_category",
	comment: ""
}

export const relation_meta = {
	//collection: "news",
	//field: "category",
	//special: ["m2o"],
	//interface: "select-dropdown-m2o",
	options: null ,
	display: null ,
	display_options: null ,
	readonly: false ,
	hidden: false ,
	sort: null ,
	width: "full" ,
	translations: null ,
	note: null ,
	conditions: null ,
	required: false ,
	group: null ,
	validation: null ,
	validation_message: null
}

export const related_text = ["$M2M$" , "$M2O$" , "$O2M$"]