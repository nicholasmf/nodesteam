var express = require('express');
var passport = require('passport');
var router = express.Router();
var mongoose = require('mongoose');
var http = require('http');
var UINT64 = require('cuint').UINT64;

var Profile = mongoose.model('Profile');
var Match = mongoose.model('Match')
var User = mongoose.model('User');
var steamapiReq = require('../steamapiReq');

var apiKey = 'C65EF0F757498EEA88019EB8C970C4A1';

router.get('/', function (req, res, next) {
    res.render('index.ejs');
});

router.get('/auth/steam/',
    passport.authenticate('steam', {failureRedirect: '/'}),
    function (req, res) {

});

router.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function (req, res) {
        //console.log(req.user);
        req.session.user = req.user._json.steamid;
        //console.log(req.session.user);
        //Profile.updateProfile(req.user._json);
        User.updateUser({
            steamid: req.user._json.steamid,
            steamid32: to32bit(req.user._json.steamid),
            _json: req.user._json
        });
        res.redirect('/#/home');
});

router.get('/dummy', function (req, res) {
    if (req.user && req.user._json.personaname) {
        //console.log(req.user._json.personaname);
        res.json({ data: req.user._json.personaname, _json: req.user._json });
    }
    else {
        res.json({ data: "Lico nubis" });

    }
});

router.get('/login', ensureAuthenticated, function (req, res) {
    res.redirect('/#/profile');
})

router.get('/prof', ensureAuthenticated, function (req, res) {
    if (req.user._json) {
        //console.log(req.user._json);
        res.json(req.user._json);
    }
});

router.get('/lastgames', ensureAuthenticated, function (req, res) {
    //var id32bit = (UINT64(req.session.user).and(UINT64(0xFFFFFFFF)));

    var id32bit = to32bit(req.session.user);

    /*
    var uri = "http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1?key=" + apiKey + "&account_id=" + id32bit;
    //console.log("id = " + id32bit);
    //console.log(uri);

    http.get(uri, function (httpres) {
        var body = '';
        console.log("starting request");
        httpres.on('error', function (err) {
            console.log("Error: " + err.message);
        }).on('data', function (data) {
            body += data;
            //console.log(data);
        }).on('end', function () {
            //console.log(body);
            res.json(body);
        });
    });
    */

    var matches = [];

    var uri = "http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1";
    var params = "account_id=" + id32bit;
    steamapiReq.httpGet(uri, params, function (data) {
        //console.log("lastgames data :" + data);
        if (!data || data == null || data == {}) { console.log("no data retrieved"); res.json(null); return; }
        res.json(data);
        

        var user = User.findOne({ steamid: req.session.user });
        user.exec(function (err, response) {
            if (err) { console.log("Error: " + e.message); }
            if (response != null) {
                matches = response.matches;
            
                data = JSON.parse(data);
                console.log("data: " + JSON.stringify(data));
                for (var i = 0; i < data.result.matches.length; i++) {
                    var id = data.result.matches[i].match_id;
                    if (matches.indexOf(id) == -1) {
                        matches.push(id);
                        console.log("match " + id + " added");
                    }
                }
                response.matches = matches;
                response.save(function (err) {
                    if (err) { console.log("Error: " + e.message); }
                });
                console.log(matches.length);
            };
        });
    });

});

router.get('/getmatch/:id', function (req, res) {
    saveMatch(req.params.id, function (data) {
        res.json(data);
    });
});

router.get('/getUsersList', function (req, res) {
    User.find({}).select('steamid steamid32 _json.personaname').exec(function (err, data) {
        if (err) { console.log("Error: ", e.message); }
        //console.log(data[0]);
        //data = data.toString().replace("_", "");
        var newData = {list: []};
        for (var i = 0; i < data.length; i++) {
            data[i] = data[i].toObject();
            newData.list.push ({
                steamid: data[i].steamid,
                steamid32: data[i].steamid32,
                personaname: data[i]._json.personaname
            });
        }
        //data[0] = data[0].toObject();
        //console.log(newData);
        res.json(newData);
    }).select;
});

router.post('/getmatches', function (req, res) {
    var args = req.body;
    //args.push(to32bit(req.session.user).toNumber());

    /*
    for (var i = 0; i < args; i++) {
        args[i] = to64bit(args[i]);
    }
    */

    var matches = {};
    var responseIds = [];
    //if (args.excludeOthers == false) console.log("Exclude Others: false");
    var queryAllUsers = User.find({steamid32: { $nin: args.list } }, { steamid32: true, _id: false });
    queryAllUsers.exec(function (err, response) {
        if (err) { console.log("Error: " + err); }
        
        if (args.excludeOthers) {
            for (var i = 0; i < response.length; i++) {
                responseIds.push(response[i].steamid32);
            }
        }
        
        /*
        for (var i = 0; i < args.list.length; i++) {
            var index = responseIds.indexOf(args.list[i]);
            if (index != -1) {
                responseIds.splice(index, 1);
                i--;
            }
        }
        */

        /*        
        var queryUsers = User.find({ steamid32: { $in: args.list } }, { matches: true, _id: false });
        queryUsers.exec(function (err, response) {
            if (err) { console.log("Error: " + err.message); }
            //console.log(response.length);
            if (response && response != null && response.length != 0) {
                if (response.length == 1) { res.send(null); return; }
                //console.log("response: " + response);
                matches = response[response.length-1].matches;
                //console.log("before: " + matches.length);
                for (var i = 0; i < response.length-1; i++) {
                    for (var j = 0; j < matches.length; j++) {
                        //var index = response[i].matches.indexOf(matches[j]);
                        if (response[i].matches.indexOf(matches[j]) == -1) { matches.remove(matches[j]); j-- }
                    }
                }
                //console.log("after: " + matches.length);
                res.send(matches);
            }
            else { res.send("Fail"); }
        })
          */
        
        var query = {
            $and: [ { "_json.result.players.account_id": { $all: args.list } }, 
                    { "_json.result.players.account_id": { $nin: responseIds } }
            ]
        };
        var retfields = { matchid: true, _id: false };

        var queryMatches = Match.find( query, retfields );
        queryMatches.exec(function (err, response2) {
            if (err) { console.log("Error: " + err); }
            if (response2 && (response2 != null)) {
                //console.log("response2: " + response2.toString());

                var matches = [];
                for (var i = 0; i < response2.length; i++) {
                    matches.push(response2[i].matchid);
                }
                res.send(matches);
            }
        })
    });

    /*
    var query = Match.find({ "_json.result.players.account_id": { $in: args } }, { matchid: true, _id: false });
    query.exec(function (err, response) {
        if (err) { console.log("Error: " + e.message); }
        if (response && response != null) {
            console.log(response);
        }
        else {
            res.send(null);
        }
    });
    */
});

router.post('/playedwith', function (req, res) {
    if (!req.body || req.body == null) { res.send("Fail"); return; }
    var playerName = req.body.name;
    playerName = playerName.toLowerCase();
    //console.log("playerName: " + playerName);
    
    var query = { "personaname": new RegExp('^' + playerName + "$", "i") };
    //console.log("query1: " + JSON.stringify(query));
    Profile.find(query, { steamid32: true, _id: false })
    .exec(function (err, data) {
        if (err) { console.log("Error: " + err); return; }
        if (!data || data == [] || data == null) { console.log("Player not found"); res.send(null); return; }
        
        var playerID = [];
        for (var i = 0; i < data.length; i++) {
            playerID.push(data[i].steamid32);
        }
        
        //console.log("playerID: " + playerID);

        var query = {
            $and: [
                { "_json.result.players.account_id": to32bit(req.session.user).toNumber() },
                { "_json.result.players.account_id": { "$in": playerID } }
            ]
        }
        //console.log("query: " + JSON.stringify(query));

        Match.find(query, { _json: true, _id: false })
        .exec(function (err, response) {
            if (err) { console.log(err); return; }
            if (!response || response == null || response == []) { res.send(null); return; }
            //console.log("response: " + response);
            res.json(response);
            return;
        });
    });
});

// Ensure that user is connected
/*
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/auth/steam');
}
*/
function ensureAuthenticated(req, res, next) {
    if (req.session.user) { return next(); }
    res.redirect('/auth/steam');
}

function to32bit(n64) {
    var id32bit = (UINT64(n64).and(UINT64(0xFFFFFFFF)));

    return id32bit;
}

function to64bit(n32) {
    var id64bit = (UINT64(n32).or(UINT64(0, 0x01100001)).toString());

    return id64bit;
}

function saveMatch(id, callback) {
    var requestProfiles = function (idlist, callback) {
        //console.log("hey");
        var namelist = [];
        var count = 0;
        
        if (idlist != '') {
            console.log("idlist: " + idlist);
            var uri = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/";
            var params = "steamids=" + idlist;
            idlist = idlist.split(",");
            steamapiReq.httpGet(uri, params, function (data) {
                //console.log(data);
                if (data == null) console.log("player " + steamid + " not found");
                
                data = JSON.parse(data);
                //console.log(data);
                data.response.players.forEach(function (player) {
                    count++;
                    //console.log(count);
                    for (var i = 0; i < idlist.length; i++) {
                        if (idlist[i] == player.steamid) {
                            namelist[idlist[i]] = player.personaname;
                            //console.log("namelist: " + namelist[idlist[i]]);
                        }
                    }
                    if (count == data.response.players.length) {
                        for (var i = 0; i < data.response.players.length; i++) {
                            var profileobj = {
                                steamid: data.response.players[i].steamid,
                                steamid32: to32bit(data.response.players[i].steamid),
                                personaname: data.response.players[i].personaname,
                                avatar: data.response.players[i].avatar,
                                avatarmedium: data.response.players[i].avatarmedium
                            };
                            //console.log(data.response.players[i]);
                            Profile.updateProfile(profileobj);
                        };
                        
                        callback(namelist);
                    }
                });
            });
        }
        else { callback(); }
    };
    
    Match.getMatchDetail(id, apiKey, function (data, isNew) {
        //console.log(data);
        
        var idlist = '';
        var count = 0;
        
        //for (var i = 0; i < data.result.players.length ; i++) {
        data.result.players.forEach(function (player) {
            //console.log(data.result.players[i].account_id);
            if (player.account_id == 4294967295) { player.personaname = "anonymous"; count++; }
            else {
                var steamid = to64bit(player.account_id);
                //console.log("id= " + steamid);
                var profile = Profile.findOne({ steamid: steamid });
                profile.exec(function (err, response) {
                    count++;
                    if (err) { console.log(err); callback(err); return; }
                    if (response) {
                        //res.json(response.data)
                        //var data = JSON.parse(response);
                        //console.log(response._json.personaname);
                        player.personaname = response.personaname;
                        //console.log(count);
                    }
                    else {
                        //console.log(steamid);
                        if (idlist == '') idlist += steamid.toString();
                        else idlist += "," + steamid.toString();
                        //console.log("idlist: " + idlist);
                    }
                    if (count == data.result.players.length) {
                        if (idlist == '') { callback(data, false); return; }
                        requestProfiles(idlist, function (getData) {
                            //console.log("data: " + getData);
                            var array = idlist.split(",");
                            //for (var i = 0; i < array.length; i++) {
                            //  console.log(getData[array[i]]);
                            
                            //}
                            for (var i = 0; i < data.result.players.length; i++) {
                                var id = to64bit(data.result.players[i].account_id);
                                if (getData[id]) {
                                    data.result.players[i].personaname = getData[id];
                                    //console.log(data.result.players[i].personaname);
                                }
                            }
                            
                            callback(data, true);
                            return;
                        });
                    }
                });
            }
            //console.log("id list: " + idlist);
        });
        //res.json(data);
    });
}

module.exports = router;