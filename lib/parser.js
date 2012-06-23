var events = require('events');
var util = require('util');
var fieldMap = require('./fieldmap');

var Parser = function(fieldmap) {
	this._readStream = null;
	this._fm = fieldmap;
}

util.inherits(Parser, events.EventEmitter);

Parser.prototype._parse = function(chunk) {
	var chars, value = '', record = {};
	chars = '' + chunk;
	var self = this;

	var addField = function() {
		if (self._fm.currentParser) 
			value = self._fm.currentParser(value);

		record[self._fm.currentKey] = value;
		value = '';
		self._fm.next();
	}

	var resetRecord = function() {
		record = {};
		self._fm.reset();
  }

	for ( var i=0; i < chars.length; i++) {
		var c = chars.charAt(i);
    switch (c) {
			case '\n':
				addField();
				self.emit('record', record);
				resetRecord();
				break;
			case '\t':
				addField();
				break;
			default:
				value = value + c;
				break;
		}
	}
}


Parser.prototype.end = function() {
}

createParser = function(fields) {
	var fm = fieldMap.createFieldMap(fields);
	var p = new Parser(fm);

	p.on('pipe', function(src) {
		p._readStream = src;
		
		p._readStream.on('data', function(chunk) {
			try {
				p._parse(chunk)
			}
			catch (e) {
				throw e;
		  }
		});

	});
  return p;

}

module.exports = {
  createParser: createParser
}
