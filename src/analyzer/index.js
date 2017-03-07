const AWS = require('aws-sdk');
const async = require('async');


exports.handler = (event, context, callback) => {
    runAnalyzer(event, callback);
};

function runAnalyzer(event, callback) {
    console.log(event);
    callback(null, event);
}