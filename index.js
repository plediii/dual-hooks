/*jslint node: true */
"use strict";

module.exports = function (Domain, libs) {
    Domain.prototype.hooks = function () {
        var d = this;
        return {
            broadcaster: require('./src/broadcaster')(d)
        };
    };
};
