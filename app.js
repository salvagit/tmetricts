console.log("tmetrics app loading...");

var args = require('argsparser').parse();
var env = args['-env'] || "dev";
var conf = require("./conf")(env);
var mongojs = require("mongojs");
var db = mongojs(conf.mongo.db, conf.mongo.collections);


var context = {
    db: db
    ,args: args

};



var express = require("express");
var bodyParser = require('body-parser');
var app = new express();
var exphbs  = require('express-handlebars');



app.use( bodyParser.urlencoded({ extended: true }) );
app.engine('hbs', exphbs( {extname: '.hbs'}));

app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){

    res.set('Access-Control-Allow-Origin', '*');

   res.out =  function(err, docs){
       if(err){ res.json({err: err, data: null});}
       else{
           res.json({err: null, data: docs});
       }//end else
    };
    next();
});

var port = args['-port'] || 3500;

app.get("/", function(req, res, next){

   res.json({name:"tmetrics", version:"1.0.0"});

});




app.get("/info/candidatos", function(req, res, nex){
   db.candidatos.find({}, {}, function(err, docs){
       res.out(err, docs);
   });
});


app.get("/info/keywords", function(req, res, nex){
    db.keywords.find({}, {}, function(err, docs){
        res.out(err, docs);
    });
});


app.get("/stats/candidato/:candidato", function(req, res, next){
    db.keywords.find({candidato: req.params.candidato}, {}, function(err, docs){
        res.out(err, docs);
    });
});


app.get("/hits/key/:key", function(req, res, next){
    var k = "#"+req.params.key;
    console.log(k);
    db.hits.find({keywords: { $in: [k]}}, {}, function(err, docs){
        res.out(err, docs);
    });
});


var server = app.listen(port, function () {
    console.log('Server creado');
});

