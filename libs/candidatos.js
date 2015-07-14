/***
 * CB (err, data);
 * @param db
 */
module.exports = function(context){

    return function(){
        this.add = function(params, cb){
            var fname  = params.fname ||  "";
            var lname = params.lname || "";
            var pol = params.pol || "";
            var web = params.web || "";
            var twitter = params.twitter || "";
            var fanpage = params.fanpage || "";


            context.db.candidatos.save({
                fname : fname
                ,lname: lname
                ,pol : pol
                ,web : web
                ,twitter: twitter
                ,fanpage: fanpage
            }, function(err, docs){
                    if(err){
                        console.log("Error dando de alta al candidato");
                        cb(err, null);
                    }else{
                        cb(null, docs);
                    }
            });
        };

        this.addKey = function(id, key, cb){
            context.db.keywords.save({
                keyword: key
                ,candidato: id
                ,count: 0
            }, function(err, docs){
                if(err){ cb(err,null);}
                else{
                    cb(null, docs);
                }
            });
        };
    };
};