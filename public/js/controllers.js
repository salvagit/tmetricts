
var serverPath = "http://tweetometro.com.ar";

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {


      $http.get(serverPath+'/info/candidatos').
          success(function(data, status, headers, config) {
            $scope.candidatos = data.data;
          }).
          error(function(data, status, headers, config) {

          });


    })

.controller('HashtagsCtrl', function($scope, $http) {

           $http.get(serverPath+'/info/keywords').
          success(function(data, status, headers, config) {
            $scope.keywords = data.data;
          }).
          error(function(data, status, headers, config) {

          });


    })

.controller('Messages', function($scope, $http) {

        
        $scope.message = {};


        var getComments = function(){
            $http.get(serverPath+"/getcomments").
                success(function(data, status, headers, config){
                    $scope.comments  = data.data;
                }).
                error(function(data, status, headers, config){

                });
        };
        getComments();


        $scope.enviar = function(){
            $http.post(serverPath+"/comment", $scope.message).
            success(function(data, status, headers, config){
                    getComments();
                }).
                error(function(data, status, headers, config){
                });
        };



});
