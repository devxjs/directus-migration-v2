## Installation

`npm i directus-migration-tools`

## Usage

### Schema Config

The file name follows the following structure: `[identifier]-[name].js` for example: `20201202A-my-custom-migration.js`

> **Note**: All migration files must be located in the Directus `extensions/migrations` folder.

### How To Create Normal Fields

Structure: `[field_name]: generateField.genNormal: (type, options)`

> **Require**: type

Example:

-   Create field by genNormal:

```javascript
type: generateField.genNormal("integer", {
    meta: {
        interface: "select-dropdown",
        options: {
            choices: [
                    { text: "Selected-respone", value: 0 },
                    { text: "Constructed-respone", value: 1 },
            ],
        },
        width: "half",
    },
}),

```

### How To Create Special Fields (Default Fields, Radio Button, Repeater, Dropdown, Image, Toggle, etc.)

Special fields can be created by some functions: sort, status, userCreated, userUpdated, dateCreated, dateUpdated, radioButton, repeater, image, files, toggle, dropdown, checkBoxes, textArea, wysiwyg,...

Example:

-   Create field with interface Radio Button:

```javascript
module: generateSpecField.radioButton([
        {
            text: "Overview",
            value: "0",
        },
        {
            text: "Problems",
            value: "1",
        },
    ]),
```

-   Create field with interface Translations:

```javascript
translations: generateSpecField.translations(
    "languages",
    "projects_categories_translations",
    {
        title: generateField.genNormal(),
    }
);
```

-   Create field with interface Image:

```javascript
thumbnail: generateSpecField.image(),
```

### How To Create Related Fields

-   Many to one: `generateM2o: (related_collection,options)`
    > **Require**: related_collection
    Example:

```javascript
   projects_translation: generateField.generateM2o(
                "projects_translations",
                {
                    field_o2m: {
                        create: true,
                        field_name: "contents",
                    },
                    meta: {
                        hidden: true,
                    },
                }
            ),
```

-   Many to many:

```javascript
generateM2m: related_collection,
    temp_collection,
    options,
    {
        field_left: [field_left],
        field_right: [field_right],
        fields_data,
    };
```

> **Require**: related_collection, temp_collection, field_left, field_right

Example:

```javascript
related: generateField.generateM2m("test","junction_test",{},{
        field_left: "test2_id",
        field_right: "test_id",
        fields_data: {
            title: generateField.genNormal() ,
            url: generateField.genNormal() ,
        }
    }),
```

-   One to many: `generateO2m: (related_collection,related_field ,options)`

> **Require**: related_collection, related_field

Example:

```javascript
menu_items: generateField.generateO2m("menu_item", {
    related_field: "menu",
    meta: {
        sort: 6,
    },
});
```

### Create Config Example

-   File name: `CDH20230425A-create.js`

```javascript
const {
    generateField,
    generateSpecField,
} = require("directus-migration-tools");

export const defaultFields = {
    id: generateField.genPrimaryKey(),
    status: generateSpecField.status(),
    sort: generateSpecField.sort(),
    date_created: generateSpecField.dateCreated(),
    date_updated: generateSpecField.dateUpdated(),
    user_created: generateSpecField.userCreated(),
    user_updated: generateSpecField.userUpdated(),
};
export const config = [
    {
        collection: {
            name: "course",
        },
        fields: {
            ...defaultFields,
            thumbnail: generateSpecField.image(),
            title: generateField.genNormal(),
            author: generateField.genNormal(),
            content: generateSpecField.wysiwyg(),
            limit_time: generateField.genNormal("integer", {
                meta: {
                    width: "half",
                },
            }),
            limit_score: generateField.genNormal("integer", {
                meta: {
                    width: "half",
                },
            }),
        },
    },
    {
        collection: {
            name: "rate",
        },
        fields: {
            course: generateField.generateM2o("course", {
                field_o2m: {
                    create: true,
                    field_name: "rates",
                },
            }),
        },
    },
    {
        collection: {
            name: "question",
            meta: {
                group: "quiz",
            },
        },
        fields: {
            ...defaultFields,
            type: generateSpecField.dropDown([
                { text: "Trắc nghiệm", value: 0 },
                { text: "Tự luận", value: 1 },
            ]),
            type_answer: generateSpecField.radioButton([
                {
                    text: "Single Answer",
                    value: 0,
                },
                {
                    text: "Multiple Answers",
                    value: 1,
                },
            ]),
            title: generateSpecField.textArea(),
            description: generateSpecField.wysiwyg(),
            image: generateSpecField.image(),
        },
    },
    {
        collection: {
            name: "answer",
            meta: {
                group: "question",
            },
        },
        fields: {
            ...defaultFields,
            type: generateSpecField.radioButton([
                {
                    text: "Image",
                    value: 0,
                },
                {
                    text: "Text",
                    value: 1,
                },
            ]),
            title: generateSpecField.textArea(),
            image: generateSpecField.image(),
        },
    },
    {
        collection: {
            name: "question",
        },
        fields: {
            answers: generateField.generateM2m(
                "answer",
                "question_answers",
                {},
                {
                    field_left: "question_id",
                    field_right: "answer_id",
                    fields_data: {
                        sort: generateSpecField.sort(),
                        correct: generateSpecField.toggle(),
                    },
                }
            ),
        },
    },
    ,
    {
        collection: {
            name: "quiz",
        },
        fields: {
            ...defaultFields,
            title: generateSpecField.textArea(),
            description: generateSpecField.wysiwyg(),
            image: generateSpecField.image(),
            time_left: generateField.genNormal("integer"),
            minimum_score: generateField.genNormal("integer"),
            questions: generateField.generateM2m(
                "question",
                "quiz_questions",
                {},
                {
                    field_left: "quiz_id",
                    field_right: "question_id",
                    fields_data: {
                        sort: generateSpecField.sort(),
                        score: generateField.genNormal("integer", {
                            options: {
                                min: 0,
                            },
                        }),
                    },
                }
            ),
        },
    },
];
```

### Update Config Example:

-   File name: `CDH20230425B-update.js`

```javascript
const {
    generateField,
    generateSpecField,
    upUpdateKnex,
    downUpdateKnex,
} = require("directus-migration-tools");

const config = [
    {
        collection: {
            name: "services",
        },
        fields: {
            items: generateField.generateM2m(
                "services_items",
                "services_items_related"
            ),
            projects: generateField.generateM2m(
                "projects",
                "services_projects_related"
            ),
            tags: generateField.generateM2m("tags", "services_tags"),
            faqs: generateField.generateM2m("faqs", "services_faqs"),
        },
    },
    {
        collection: {
            name: "services_translations",
        },
        fields: {
            subtitle: generateField.genNormal("string"),
            subdescription: generateSpecField.textArea(),
        },
    },
    {
        collection: {
            name: "projects",
            meta: {
                display_template: "{{translations}}",
            },
        },
        fields: {
            banner: generateSpecField.image(),
            website: generateField.genNormal(),
            published_date: generateSpecField.dateTime(),
            color: generateField.genNormal("string", {
                meta: {
                    interface: "select-color",
                },
            }),
            partner: generateField.generateM2o("partners"),
            category: generateField.generateM2o("projects_categories"),
            solutions: generateField.generateM2m(
                "solutions",
                "projects_solutions_related"
            ),
            related_projects: generateField.generateM2m(
                "projects",
                "projects_projects_related"
            ),
        },
    },
];

module.exports = {
    async up(knex) {
        await upUpdateKnex(knex, config);
    },
    async down(knex) {
        await downUpdateKnex(knex, config);
    },
};
```

> **Note** Migrations have to export an `up` and a `down` function. These functions get a [Knex](http://knexjs.org/) instance that can be used to do virtually whatever.
