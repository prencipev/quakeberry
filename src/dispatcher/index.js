const AWS = require('aws-sdk');
const ruleName = 'simulator_rule';
const response = require('../response');
const createIndex = require('./createIndex.js');


exports.handler = (event, context, callback) => {
    //createIndex();
    runShadowThingRegister(event, callback);
};

function runShadowThingRegister(event, callback) {
    var myRes = response();
    var params = event.pathParameters;
    var topic = params.topic;

    const iotdata = new AWS.IotData({ endpoint: "ak8by74ifg9ks.iot.eu-west-1.amazonaws.com", region: 'eu-west-1' });

    var params = {
        topic: topic + '/topic',
        payload: event.body,
        qos: 0
    };

    iotdata.publish(params, function(err, data) {
        if (err) {
            console.log(err);
            myRes.statusCode = 400;
            myRes.body = JSON.stringify({ "error": err });
            callback(err, myRes);
        } else {
            myRes.statusCode = 200;
            myRes.body = JSON.stringify(event.body);
            callback(null, myRes);
        }
    });
}