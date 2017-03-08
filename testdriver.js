process.env['REGION'] = 'eu-west-1';
process.env['PROFILE'] = 'fulldev';
process.env['LOG'] = '1';


var callback = function() {
    console.log("Lambda Function Complete");
};

var fs = require('fs');
var app = require('./handler.js');
var event = JSON.parse(fs.readFileSync('./mocks/event.json', 'utf8').trim());

var context = {};


context.done = function() {
    console.log("Lambda Function Complete");
};

app.process(event, context, callback);