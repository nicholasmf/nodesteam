var http = require('http');

var apiKey = 'C65EF0F757498EEA88019EB8C970C4A1';

var apiRequest = {};

apiRequest.apiKey = apiKey;

apiRequest.httpGet = function (uri, params, callback) {
    var request = uri + "?key=" + apiKey + "&" + params;

    http.get(request, function (response) {
        var body = '';
        response.on('error', function (err) {
            callback(err);
        })
        .on('data', function (data) {
            body += data;
        })
        .on('end', function () {
            callback(body);
        });
    })
}

module.exports = apiRequest;