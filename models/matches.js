var mongoose = require('mongoose');
var http = require('http');

var MatchSchema = new mongoose.Schema({
    matchid: String,
    _json: Object
});

MatchSchema.statics.getMatchDetail = function (id, apiKey, callback) {
    if (!id || !apiKey || id == '' || apiKey == '') { return; }

    var body = '';
    var matchobj = {
        matchid: id,
        _json: ''
    };
    var newMatch = new this(matchobj);

    var match = this.findOne({ matchid: id });
    match.exec(function (err, response) {
        if (err) { console.log("error: " + err.message); return; }
        if (response != null) {
            //console.log(JSON.stringify(response.json));
            //console.log((response.json));
            //res.json(JSON.stringify(response.json));
            console.log("match alreay added");
            callback(response._json, false);
        }
        else {
            var uri = "http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1?key=" + apiKey + "&match_id=" + id;

            //console.log(uri);

            http.get(uri, function (httpres) {
                var body = '';
                console.log('starting match request');

                httpres.on('error', function (err) {
                    console.log('Error: ' + err.message);
                })
                .on('data', function (data) {
                    body += data;
                })
                .on('end', function () {
                    //console.log(body);
                    newMatch.set('_json', JSON.parse(body));
                    newMatch.save(function (err) {
                        if (err) { console.log(err); return; }
                        console.log("new match added");
                    });
                    //res.json(body);
                    callback(JSON.parse(body), true);
                });
            });
        }
    })
};

mongoose.model('Match', MatchSchema);