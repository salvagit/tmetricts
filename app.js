console.log("tmetrics app loading...");

var args =    require('argsparser').parse();
var env =     args['-env'] || "dev";
var conf =    require("./conf")(env);
var mongojs = require("mongojs");
var db =      mongojs(conf.mongo.db, conf.mongo.collections);
var cookieParser = require('cookie-parser');

var context = {
    db: db,
    args: args
};

var targets =  require("./libs/targets");
var admins =   require("./libs/admins");
var keywords = require("./libs/keywords");

var express =    require("express");
var bodyParser = require('body-parser');
var app = new express();
var exphbs =     require('express-handlebars');

targets = new targets(context);
admins = new admins(context);
keywords = new keywords(context);

app.use( bodyParser.urlencoded({ extended: true }) );
app.use(cookieParser());
app.engine('hbs', exphbs( {extname: '.hbs'}));

app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

var session = require('express-session');

app.use(session({
    genid: function(req) {
        return new Date().getTime()
    },
    secret: 'tmetric sessions key',
    resave: true,
    saveUninitialized: true
}));


app.use(function(req, res, next) {

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', '*');
  res.set('Access-Control-Allow-Headers', '*');

  res.out =  function(err, docs) {
    if(err) {
      res.json({err: err, data: null});
    } else {
      res.json({err: null, data: docs});
    }//end else
  };

  console.log("Cookies: ", req.cookies);
  next();
});

var port = args['-port'] || 3500;

app.get("/admin", function(req, res, next){
    res.json({cookie: req.sessions});
});

app.get("/admin/login", function(req, res, next){
    res.json({cookie: req.sessions});
});

app.get("/info/candidatos", function(req, res, nex){
    targets.getAll()
        .then(function(docs){
            res.out(null, docs);
        }, function(err){
            res.out(err, null);
        })
});

app.get("/info/keywords", function(req, res, nex){
    db.keywords.find({}, {}).sort({count:-1}).toArray( function(err, docs){
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

    db.hits.find({keywords: { $in: [k]}}, {}, function(err, docs){
        res.out(err, docs);
    });
});

app.post("/comment", function(req, res, next){

    var body = JSON.parse(Object.keys(req.body)[0]);

    var params = {
        name: body.name || "noName",
        email : body.email || "NoMail",
        message: body.message || "",
        added :  new Date()
    };

    db.comments.save(params, function(err, d){
        if(err) {
            res.out(err, null);
            console.log("Error guardando el mensaje");
        } else {
            console.log("Mensaje guardado ");
            res.out(null, params);
        }
    })
});

app.get("/getcomments", function(req, res, next){
    db.comments.find({}, {}).sort({added:-1}).limit(20).toArray( function(err, data){
        if(err) {
            res.out(err, null);
        } else {
            res.out(null, data);
        }
    })
});

var server = app.listen(port, function () {
    console.log('Server started ', port);
});
