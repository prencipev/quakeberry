const AWS = require('aws-sdk');
const ruleName = 'simulator_rule';


exports.handler = (event, context, callback) => {
    runDeviceActivity(event, callback);
};

function runDeviceActivity(event, callback) {

    const topic = "analyzer";
    var IotEndpoint = event.thingIotEndpoint;
    const iotdata = new AWS.IotData({ endpoint: IotEndpoint, region: 'eu-west-1' });

    var params = {
        topic: topic + '/topic',
        payload: JSON.stringify(event),
        qos: 0
    };

    iotdata.publish(params, function(err, data) {
        if (err) {
            callback(err);
        } else {
            console.log("data to analyze:", JSON.stringify(event));
            callback(null, event);
        }
    });
}