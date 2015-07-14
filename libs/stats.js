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
            console.log("updateKeywordsStats");


                for(var x in _this.keys){
                var key = _this.keys[x];

                (function(k){
                    _this.db.keywords.update({_id: _this.db.ObjectId(k._id.toString())}
                                            , {$set: {count: k.count}}, function(err, d){
                            if(err){ console.log("Error update key: ", k);}
                            else{
                                console.log("Update key ok");
                            }
                        });
                })(key);
            }//end for
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

                updateKeywordsStats();
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