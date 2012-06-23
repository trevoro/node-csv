var FieldMap = function (fields) {
	this._fields = fields;
	this.position = null;
	this.keys = [];
	this.length = null;
	this.currentKey = '';
}

FieldMap.prototype.next = function () {
	// move position counter
  this.position++;
	this.currentKey = this.keys[this.position];
	this.currentParser = this._fields[this.currentKey];
}

FieldMap.prototype.reset = function () {
	this.keys = Object.keys(this._fields);
	this.length = Object.keys(this._fields).length;
	this.currentKey = Object.keys(this._fields)[0];
	this.currentParser = this._fields[this.currentKey];
	this.position = 0;
}

var createFieldMap = function (fields) {
  for (var key in fields) {
		if (fields[key] !== null) {
			if (typeof(fields[key]) !== 'function') 
				throw new TypeError('field parser must be a function or null');
		}
	}

	var f = new FieldMap(fields);
	f.reset();
	return f;
};

module.exports = {
	createFieldMap: createFieldMap
}
