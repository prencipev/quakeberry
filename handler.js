'use strict';

module.exports = {
    simulator: require("./src/simulator").handler,
    analyzer: require("./src/analyzer").handler,
    dispatcher: require("./src/dispatcher").handler,
    process: require("./src/process").handler
};