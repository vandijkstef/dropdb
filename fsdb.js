const fs = require('fs');

module.exports = class FSDB {
	constructor(options = {}) {
		this.folder = options.folder || 'db';
		this.folder = `./${this.folder}`;
		if (!fs.existsSync(this.folder)) {
			fs.mkdirSync(this.folder);
		}
	}

	get(table, key) {
		const ff = this._ff(table, key);

		if (!fs.existsSync(ff.file)) {
			return false;
		}

		let entry;
		try {
			entry = JSON.parse(fs.readFileSync(ff.file, 'utf8'));
		} catch(e) {
			return false;
		} finally {
			return entry;
		}
	}

	query(table, query) {
		const ff = this._ff(table);

		const tableData = [];
		const keys = fs.readdirSync(ff.folder);
		keys.forEach((key) => {
			const ff = this._ff(table, key);
			let entry;
			try {
				entry = JSON.parse(fs.readFileSync(ff.file, 'utf8'));
			} catch (e) {
				console.warn('query error');
			} finally {
				tableData.push(entry);
			}
		});

		const returnData = [];
		let ge, le;
		switch(query.compare) {
			case '=':
			case 'e':
			case 'equals':
				tableData.forEach((entry) => {
					if (entry[query.field] != undefined && entry[query.field] === query.value) {
						returnData.push(entry);
					}
				});
				break;
			case '!=':
			case '!e':
			case 'empty':
				tableData.forEach((entry) => {
					if (entry[query.field] === undefined) {
						returnData.push(entry);
					}
				});
				break;
			case '>=':
			case 'gte':
				ge = true;
			case '>':
			case 'gt':
				tableData.forEach((entry) => {
					if (entry[query.field] != undefined && entry[query.field] >= query.value) {
						if (entry[query.field] === query.value && ge || entry[query.field] > query.value) {
							returnData.push(entry);
						}
					}
				});
				break;
			case '<=':
			case 'lte':
				le = true;
			case '<':
			case 'lt':
				tableData.forEach((entry) => {
					if (entry[query.field] != undefined && entry[query.field] <= query.value) {
						if (entry[query.field] === query.value && le || entry[query.field] < query.value) {
							returnData.push(entry);
						}
					}
				});
				break;
		}

		return returnData;

	}

	insert(table, key, data) {
		const ff = this._ff(table, key);
		
		if (fs.existsSync(ff.file)) {
			return false;
		}

		if (!fs.existsSync(ff.folder)) {
			fs.mkdirSync(ff.folder);
		}
		data.key = key;
		fs.writeFileSync(ff.file, JSON.stringify(data, null, 4));
		return true;
	}

	update(table, key, data) {
		const ff = this._ff(table, key);
		
		if (!fs.existsSync(ff.file)) {
			return false;
		}

		let oldData;
		try {
			oldData = JSON.parse(fs.readFileSync(ff.file, 'utf8'));
		} catch (e) {
			return false;
		} finally {
			Object.assign(oldData, data);
			fs.writeFileSync(file, JSON.stringify(oldData, null, 4));
			return true;
		}
	}

	_ff(table, key) {
		const ff = {
			folder: `${this.folder}/${table}`
		}
		if (key) {
			ff.file = `${ff.folder}/${key.replace('.json', '')}.json`;
		}
		return ff;
	}
}