module.exports = function(context){
    return function(){
        var _this = this;
        this.db = context.db;


        var process = function(hit){

            for(var x=0; x<hit.keywords.length; x++){
                var k = hit.keywords[x];

                if(typeof _this.keys[k]!="undefined") {
                   _this.keys[k].count++;
                }//
            }//end for


            var $set = {
                process : true
                ,step1 : true
            };


            if(hit.keywords.length==0){
                $set.key = false;
            }


            _this.db.hits.update({_id: _this.db.ObjectId(hit._id.toString())}
                                ,{$set: $set}, function(err, d){
                   if(err){ console.log("Error update hit");}
                    else{

                   }
                });
        };


        var updateKeywordsStats = function(){

                var candidatos = {};
                for(var x in _this.keys){
                    var key = _this.keys[x];

                    typeof candidatos[key.candidato]=="undefined"
                                                    ? candidatos[key.candidato] = {count: key.count}
                                                    : candidatos[key.candidato].count+=key.count;


                    (function(k){
                        _this.db.keywords.update({_id: _this.db.ObjectId(k._id.toString())}
                                                , {$set: {count: k.count}}, function(err, d){
                                if(err){ console.log("Error update key: ", k);}
                                else{
                                    //console.log("Update key ok");
                                }
                            });
                })(key);
            }//end for keywords


            for(var x in candidatos){

                (function(can){
                    _this.db.candidatos.update({_id: _this.db.ObjectId(x)}
                                    , {$set:{count: can.count}}, function(err, d){
                                if(err){ console.log("Error update candidato: ", can);}
                                else{ }
                        });
                })(candidatos[x]);
            }//end for candidatos
        };

        var loadKeywords = function(cb){
            _this.keys = {};
            _this.db.keywords.find({}, {}, function(err, keys){
                if(err) console.log("Error load keys");
                else {
                    for(var x=0; x<keys.length; x++){
                        _this.keys[keys[x].keyword] = {count: keys[x].count, candidato: keys[x].candidato, _id: keys[x]._id};
                    }//end for
                } //end else

                cb();
            });
        };

        var getHits = function(){
            _this.db.hits.find({process:false}, {}).limit(100).toArray(function(err, docs){
                if(err) console.log("Error levantando hits");
                else{
                    for(var x=0; x<docs.length; x++) new process(docs[x]);
                }//end else

                if(docs.length>0) updateKeywordsStats();
            });
        };

        this.init = function(){
            console.log("Procesando hits");

            setInterval(function(){
                loadKeywords(function(){
                    getHits();
                });
            }, 1000);

        };


    };
};