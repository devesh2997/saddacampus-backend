var assert = require('assert');
var http = require("http");

var config = require('./config.json');

/**
 * sends message provided to the given number.
 * @param {Object} args 
 * @param {String} args.country_code
 * @param {String} args.number
 * @param {String} args.message
 * @param {function} callback 
 */
exports.send = function(args, callback){
    assert(args.country_code, args.number, args.message);
    var mobile_number = args.country_code + args.number;

    
    var message = require('querystring').escape(args.message);
    var options = {
    "method": "GET",
    "hostname": "api.msg91.com",
    "port": null,
    "path": "/api/sendhttp.php?sender=SDCMPS&route=4&mobiles=" + mobile_number + "&authkey=" + config.authkey + "&country=0&message="+message,
    "headers": {}
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            callback(null, body);
        });
    });

    req.end();
}