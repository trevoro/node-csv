var events = require('events');
var util = require('util');
var fieldMap = require('./fieldmap');

var Parser = function(fieldmap) {
	this._readStream = null;
	this.fm = fieldmap;
	this.state = {
		record: {},
		chars: '',
		value: ''
	}

}

util.inherits(Parser, events.EventEmitter);

Parser.prototype._parse = function(chunk) {
	var self = this;
	
	var chars = '' + chunk;
	self.state.value

	var addField = function() {
		if (self.fm.currentParser) 
			self.state.value = self.fm.currentParser(self.state.value);

		self.state.record[self.fm.currentKey] = self.state.value;
		self.state.value = '';
		self.fm.next();
	}

	var resetRecord = function() {
		self.state.record = {};
		self.fm.reset();
  }

	for ( var i=0; i < chars.length; i++) {
		var c = chars.charAt(i);
    switch (c) {
			case '\n':
				addField();
				self.emit('record', self.state.record);
				resetRecord();
				break;
			case '\t':
				addField();
				break;
			default:
				self.state.value += c;
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
