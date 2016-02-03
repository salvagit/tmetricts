"use strict";

function hits(context){
    var self = this;
    self.db = context.db;
};


hits.prototype.save = function(){
    var self = this;

    return new Promise(function(resolve, reject){
        self.db.hits.save(hit, function(err, docs){
            if(err) reject('Error HTH200 '+err);
            else resolve(docs);
        });
    });
};


module.exports = hits;