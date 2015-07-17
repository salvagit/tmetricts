module.exports = function(env){
        var env = env || 'dev';

    var conf = {};
    conf.dev= {
        mongo: {
            host: "127.0.0.1"
            ,db: "tmetrics"
            ,collections: ['keywords', 'candidatos', 'stats', 'hits', 'comments']
        }
        ,express: {
            port: 1234
        }
    };

    conf.prod = JSON.parse(JSON.stringify(conf.dev));
    conf.prod.mongo.host = "192.168.0.113";



    return typeof conf[env]=="undefined" ? conf.dev : conf[env]

};