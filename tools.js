

var args = require('argsparser').parse();
var env = args['-env'] || "dev";
var conf = require("./conf")(env);
var mongojs = require("mongojs");
var db = mongojs(conf.mongo.db, conf.mongo.collections);


var context = {
    db : db
    ,args : args
};


var candidatos = require("./libs/candidatos")(context);
var admins = require("./libs/admins")(context);

var cmd = args['-cmd'] || "about";


var about = function(){
    console.log(" Tools v1.0 ");
    process.exit();
};

var admin = function(){
    var act = args['-act'] || "";

    var addAdmin = function(){
        var params = {
            email : args['-email'] || ""
            , password : args['-password'] || ""
        };



        if(params.email=="" || params.password=="") { console.log("faltan argumentos"); return;}

        new admins().add(params, function(err, data){
            if(err){ console.log("Error adding admin: ", params);}
            else{ console.log("admin added");}
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


var candidato = function(){
    console.log("module candidato");
    var act = args['-act'] || "";


    var add = function(){
        var params = {
            fname : args['-fname'] || ""
        ,lname : args['-lname'] || ""
        ,pol : args['-pol'] || ""
        ,web : args['-web'] || ""
        ,twitter : args['-twitter'] || ""
        ,fanpage : args['-fanpage'] || ""
        }

        new candidatos().add(params, function(err, data){
            if(err){ console.log(err);}
            else console.log("Candidato agregado ok");

            process.exit();
        });
    };



    var addkey = function(){
        var key = args['-key'] || "";
        var can = args['-can'] || "";
        if(key=="" || can=="") {
            console.log("No key, error");
            process.exit();
        }

        new candidatos().addKey(can, key,function(err, dat){
            if(err){ console.log(err); }
            else{
                console.log("la keyword fue agregada con éxito");
            }
            process.exit();
        });

    };

    switch (act){
        case 'add': add(); break;
        case 'key': addkey(); break;
        case '':default:
            console.log("no act");
            break;
    }
};

console.log("CMD> ", cmd);
switch(cmd){
    case 'about': about(); break;
    case 'candidato': candidato(); break;
    case 'admin': admin(); break;
}
