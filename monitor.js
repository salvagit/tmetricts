console.log("iniciando monitor");

var args = require('argsparser').parse();
var env = args['-env'] || "dev";
var conf = require("./conf")(env);
var mongojs = require("mongojs");
var db = mongojs(conf.mongo.db, conf.mongo.collections);


var context = {
  db: db
    ,args: args

};


var Twitter = require('node-twitter');

var twitterStreamClient = new Twitter.StreamClient(
    'lU74fpJNyaNTZBwF1Uw9rghgH',
    'cB2nsSJZMcK4MvcdtHxqqOPwssDzYmWSdBvuGQf4qUVsgpVnoY',
    '174770913-eq7RVBxqsMvfpnslX5iKquxX5fwrRgaH5SoQ2I0b',
    '2xxVgt5jHIPmMEnAfnw5SFMaMbL0quiOmexhIKqZKMejf'
);



twitterStreamClient.on('close', function() {
    console.log('Connection closed.');
});

twitterStreamClient.on('end', function() {
    console.log('End of Line.');
});

twitterStreamClient.on('error', function(error) {
    console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
});


var keywords = [];


var tAction = function(tweet){
    var keys = [];

    for(var x=0; x<keywords.length; x++){
        if(tweet.text.indexOf(keywords[x])>-1){
            console.log("DEBUG: >", tweet.text, keywords[x]);
            keys.push(keywords[x]);
        }
    }//end for

    tweet.keywords = keys;
    console.log("Llego: ", tweet);
    db.hits.save(tweet);

};


db.keywords.find({}, {}, function(err, docs){
        if(err){ console.log("Error levantando keywords");}
        else{
                if(docs.length==0){
                    console.log("No hay keywords que levantar");
                    db.keywords.save({keyword: "#fpv"}, function(){
                        process.exit();
                    });

                }else{
                    for(var x=0; x<docs.length; x++) keywords.push(docs[x].keyword);
                    console.log("Trackeando : ", keywords);
                    twitterStreamClient.on('tweet', tAction);
                    twitterStreamClient.start(keywords);
                    }//end else si key
            }//end else error
});

