"use strict";

function targets(context){
    var self = this;
    self.db = context.db;
};

targets.prototype.add = function(params){
    var self = this;
    var fname  = params.fname ||  "";
    var lname = params.lname || "";
    var pol = params.pol || "";
    var web = params.web || "";
    var twitter = params.twitter || "";
    var fanpage = params.fanpage || "";

    return new Promise(function(resolve, reject){
        self.db.targets.save({
            fname : fname,
            lname: lname,
            pol : pol,
            web : web,
            twitter: twitter,
            fanpage: fanpage
        }, function(err, docs){
            if(err) reject('Error TRG200');
            else resolve(docs);
        });
    });//end promise
};

targets.prototype.getAll = function(){
  var self = this;

    return new Promise(function(resolve, reject){
        self.db.targets.find({}, {}).sort({count:-1}).toArray(function(err, docs){
            if(err) reject('Error OOS200');
            else resolve(docs);
        });
    });
};

module.exports = targets;
