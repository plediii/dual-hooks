/*jslint node: true */
"use strict";

var defaultData = function () {
    return {

    };
};

module.exports = function (d) {
    return function (params) {
        var data;
        if (params.hasOwnProperty('data')) {
            data = params.data;
        } else {
            data = defaultData();
        }
    };
};
