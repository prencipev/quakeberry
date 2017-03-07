const AWS = require('aws-sdk');


exports.handler = (event, context, callback) => {
    //createIndex();
    runShadowThingRegister(event, callback);
};

function runShadowThingRegister(event, callback) {
    console.log(JSON.stringify(event));
}