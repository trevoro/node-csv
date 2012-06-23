# node-csv - Stream based CSV parser

## Creating a CSV parser stream


    var fs = require('fs');
    var csv = require('./lib/index');

    var parser = csv.createParser({
      id: parseInt,
      firstName: null,
      lastName: null
    })

    parser.on('record', function(record) {
      console.log(JSON.stringify(record))
    }

    var rs = fs.createReadStream('example.csv');
    rs.pipe(parser);

