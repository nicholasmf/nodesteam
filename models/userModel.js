var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    steamid: { type: String, index: true, unique: true },
    steamid32: { type: Number },
    _json: Object,
    matches: [{type: String, ref: '' }]
});

userSchema.statics.updateUser = function (profile, cb) {
    if (!profile || profile == null || !profile.steamid) { return; }
    //console.log("Adding: " + profile.steamid);
    var newProf = new this(profile);

    var prof = this.findOne({ steamid: profile.steamid });
    //console.log(prof.count());
    prof.exec(function (err, response) {
        if (err) { console.log(err); return (err); }
        if (response != null) {
            /*
            this.update(prof, { personaname: profile.personaname }, function (err, response) {
                if (err) { return next(err); }
                   console.log("profile updated");
            })
            */
            response._json = profile._json;
            response.save(function (err) {
                if (err) { return err; }
                console.log("profile updated: " + profile.steamid);
            });
        }
        else {
            newProf.save(cb, function (err) {
                if (err) { return next(err); }
                console.log("profile created");
            })
        }
    });
    /*
    newProf.save(cb, function (err) {
        if (err) { return next(err); }
        console.log("profile created");
    })
    */
    return prof;
}

mongoose.model('User', userSchema);