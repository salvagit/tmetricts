var debug = require('debug')('tmetrics:tool')
var args = require('argsparser').parse();
var env = args['-env'] || "dev";
var conf = require("./conf")(env);
var mongojs = require("mongojs");
var db = mongojs(conf.mongo.db, conf.mongo.collections);
var keywords = require("./libs/keywords");
var hits = require("./libs/hits");
var targets = require("./libs/targets");
var admins = require("./libs/admins");

var context = {
    db : db,
    args : args
};

targets = new targets(context);
admins = new admins(context);
keywords = new keywords(context);
var cmd = args['-cmd'] || "about";

var about = function(){
    console.log(" Tools v1.0 ");
    process.exit(0);
};

var admin = function(){
    var act = args['-act'] || "";

    var addAdmin = function(){
        var params = {
            email : args['-email'] || "",
            password : args['-password'] || ""
        };

        if(params.email=="" || params.password=="") { console.log("faltan argumentos"); return;}

        admins.add(params)
            .then(function(data){
                console.log('Added ');
            }, function(err){
                console.log('Error: ', err);
            });
    };

    switch(act){
        case 'add': addAdmin(); break;
        case '':
        default:
            console.log("Invalid ACT for Admin cmd: ", act);
            break;
    }
};


var target = function() {
    var act = args['-act'] || "";

    var add = function(){
        var params = {
            fname : args['-fname'] || "",
            lname : args['-lname'] || "",
            pol : args['-pol'] || "",
            web : args['-web'] || "",
            twitter : args['-twitter'] || "",
            fanpage : args['-fanpage'] || ""
        }

        targets.add(params)
            .then(function(data) {
                console.log("Target added: ", data._id);
                process.exit(0);
            }, function(err){
                console.log('Error: ', err);
                process.exit(1);
            });
    };

    var addkey = function(){
        var key = args['-key'] || "";
        var target = args['-target'] || "";
        if(key=="" || target=="") {
            console.log("No key, error");
            process.exit(1);
        }

        keywords.addKey(target, key)
            .then(function(dat){
                console.log('keywords added: ', dat);
                process.exit(0);
            }, function(err){
                debug(err);
                process.exit(1);
            });

    };

    switch (act){
        case 'add': add(); break;
        case 'key': addkey(); break;
        case '':
        default:
            console.log("no act");
            break;
    }
};

console.log("CMD>", cmd);
switch(cmd){
    case 'about': about(); break;
    case 'target': target(); break;
    case 'admin': admin(); break;
}
