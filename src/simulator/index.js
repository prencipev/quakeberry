const createIndex = require('./createIndex.js');
const AWS = require('aws-sdk');
const ruleName = 'simulator_rule';

var event;
var context;
createIndex();

exports.handler = (event, context, callback) => {
    runSimulator(event, callback);
};

function runSimulator(event, callback) {
    const iotdata = new AWS.IotData({ endpoint: "ak8by74ifg9ks.iot.eu-west-1.amazonaws.com", region: 'eu-west-1' });
    var params = {
        topic: 'simulator/topic',
        payload: JSON.stringify(event),
        qos: 0
    };

    iotdata.publish(params, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log(params);
            callback(null, params);
        }
    });
}