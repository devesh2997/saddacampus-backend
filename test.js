var http = require("http");
var message = require('querystring').escape('hey, this is a test message');
var options = {
  "method": "GET",
  "hostname": "api.msg91.com",
  "port": null,
  "path": "/api/sendhttp.php?sender=SDCMPS&route=4&mobiles=+917541833368&authkey=209796AOqi9x6tZE45ad0695f&country=0&message="+message,
  "headers": {}
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();