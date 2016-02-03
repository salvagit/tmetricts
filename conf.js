"use strict";

module.exports = function(env){
    var env = env || 'dev';
    var conf = {};

    conf.dev= {
        mongo: {
            host: "127.0.0.1"
            ,db: "tmetrics"
            ,collections: ['keywords', 'targets', 'stats', 'hits', 'comments','admins']
        }
        ,express: {
            port: 1234
        }
    };

    conf.prod = JSON.parse(JSON.stringify(conf.dev));
    conf.prod.mongo.host = "0.0.0.0"; //change here for production

    return typeof conf[env]=="undefined" ? conf.dev : conf[env]

};