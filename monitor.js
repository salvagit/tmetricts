var debug = require("debug")("tmetrics:monitor");
var args = require('argsparser').parse();
var env = args['-env'] || "dev";
var conf = require("./conf")(env);
var mongojs = require("mongojs");
var db = mongojs(conf.mongo.db, conf.mongo.collections);
var keywords = require("./libs/keywords");
var hits = require("./libs/hits");

var context = {
  db: db
    ,args: args

};


keywords = new keywords(context);
hits = new hits(context);


var Twitter = require('node-twitter');

var twitterStreamClient = new Twitter.StreamClient(
    'yd18NwzuM9lc1uaGlw', //CONSUMER_KEY
    'jn5iDu4eQ1DqxMu0dMyl4wjXAzKtHqvqx1Ru6kcs', //CONSUMER_SECRET
    '174770913-u75czhuRcBZoZL54enzIvsgkWZyUHqcHsqqdMD5A', //TOKEN
    'Jdt7uc4uupVIKJUhabo1K9BmOguHwkY4ljZ5846vqQ' //TOKEN_SECRET
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


var trackKeywords = [];
var tweetsStore = [];

var tAction = function(tweet){
    var keys = [];

    for(var x=0; x<trackKeywords.length; x++){
        if(tweet.text.toLowerCase().indexOf(trackKeywords[x].toLowerCase())>-1){
            console.log("TWEET: >", tweet.text, trackKeywords[x]);
            keys.push(trackKeywords[x]);
        }
    }//end for

    tweet.keywords = keys;
    tweet.process = false;

    debug("hit: "+ tweet.text +' ['+ tweet.keywords.join()+']');
    tweetsStore.push(tweet);
};


var saveController = function(){
    var tweet = tweetsStore.shift();
    hits.save(tweet)
        .then(function(){

        }, function(err){
            debug('Error OOT500');
        });
    if(tweet) db.hits.save(tweet);
};

setInterval(saveController, 100);




keywords.loadKeywords()
    .then(function(keys){
        console.log('Tracking: ', keys);

        for(var k in keys) trackKeywords.push( k );
        if(trackKeywords.length>0){
            twitterStreamClient.on('tweet', tAction);
            twitterStreamClient.start(trackKeywords);
        }else{
            console.log('Use tools.js file for add targets/keywords ');
            process.exit(1);
        }

    }, function(err){
        debug('Error: not keywords setters');
    });

