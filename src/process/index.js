const AWS = require('aws-sdk');
const ruleName = 'simulator_rule';
const thingIotEndpoint = "https://ak8by74ifg9ks.iot.eu-west-1.amazonaws.com";

exports.handler = (event, context, callback) => {
    runDeviceActivity(event, callback);
};

function runDeviceActivity(event, callback) {

    const topic = "analyzer";
    var IotEndpoint = thingIotEndpoint; //event.thingIotEndpoint;
    const iotdata = new AWS.IotData({ endpoint: IotEndpoint, region: 'eu-west-1' });

    var params = {
        topic: topic + '/topic',
        payload: "",
        qos: 0
    };

    event.Records.forEach(function(record) {
        // Kinesis data is base64 encoded so decode here
        var payload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
        params.payload = payload;
        iotdata.publish(params, function(err, data) {
            if (err) {
                callback(err);
            } else {
                console.log("data to analyze:", JSON.stringify(payload));
                callback(null, event);
            }
        });
        console.log('Decoded payload:', payload);
    });


}