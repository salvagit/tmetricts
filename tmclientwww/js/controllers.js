
var serverPath = "http://localhost.com.ar:2222";

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {
        console.log("Empezamos a trabajar: ", $scope);

      $http.get(serverPath+'/info/candidatos').
          success(function(data, status, headers, config) {
            $scope.candidatos = data.data;
            console.log(data);
          }).
          error(function(data, status, headers, config) {

          });


    })

.controller('HashtagsCtrl', function($scope, $http) {

      $http.get(serverPath+'/info/keywords').
          success(function(data, status, headers, config) {
            $scope.keywords = data.data;
            console.log(data);
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
          console.log("Hicieron click ", $scope.message);
            $http.post(serverPath+"/comment", $scope.message).
            success(function(data, status, headers, config){
                    
                    getComments();
                }).
                error(function(data, status, headers, config){
                    console.log("Error tratando de enviar el mensaje");
                });
        };



});
