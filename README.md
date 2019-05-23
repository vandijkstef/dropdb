# FSDB
> A file-based db system for prototyping in Node Projects

This module provides a simple file based database using folders as tables and files are rows/entries. It is created as a drop-in db system for your prototypes and small personal projects. That being said, I tried keeping the logic close to known DB systems so swapping it out should be relatively easy

## Usage
Note that only full entries are returned. There's no such thing as selecting certain fields. FSDB is a class, and thus needs to be required and instantiated:

``` JS
const fsdb = require('fsdb');
const db = new fsdb(options);
db.get(table, key);
```

### Configuration
The following object is the fallback object. By passing in an object in the constructor you can override them.
``` JS
{
	folder: 'db',
}
```

### Common Keywords
``` JS
table: string
key: string
data: object
```

### get(table, key)
Returns a single entry by its table and key

### insert(table, key, data)
Insert a new entry, cannot update exsisting entries

### update(table, key, data)
Update an entry, cannot insert new entries

### query(table, query)
Returns an array of entries, currently limited to one table.
The `query` variable expects an object as following:
``` JS
{
	field: '', // Field name/key
	compare: '', // Comparitive action
	value: '' // Comparitive value
}
```

#### = | e | equals
Exact match

#### != | !e | empty
Returns entries where the field isn't set or is set to undefined.

#### > | gt / >= | gte
Returns entries where the value in the field is higher.

#### < | lt / <= | lte
Returns entries where the value in the field is lower.