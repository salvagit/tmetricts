/***
 * CB (err, data);
 * @param db
 */

var crypto = require('crypto');

var shasum = crypto.createHash('md5');

module.exports = function(context){

    return function(){
        this.add = function(params, cb){

            var email = params.email || "";
            var password = params.password || "";

            var ps = shasum.update(params.password).digest("hex");



            context.db.admins.save({
                email: params.email
                ,added: new Date()
                ,password : ps
            }, function(err, docs){
                if(err){
                    console.log("Error dando de alta al administrador ", params);
                    cb(err, null);
                }else{
                    cb(null, docs);
                }
            });
        };//end add

        this.login = function(params, cb){

            var email = params.email || "";
            var password  = params.password ||  "";
            var ps = shasum.update(password).digest("hex");

            context.db.admins.findOne({email: email, password: ps}, {}, function(err, data){
                if(err){ cb(err, null); }
                else{
                    if(data){
                        cb(null, data);
                        db.admins.update({_id: data._id}, {$set: {lastlogin: new Date()}}, function(){
                            console.log("data saved");
                        });
                    }else{
                        cb("Bad login", data);
                    }//end else
                }//end else
            });

        };//end login
    };//end return
};