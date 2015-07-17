// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

   $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

   $stateProvider
  .state('dash', {
    url: '/dash',
    views: {
      'viewpoint': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('hashtags', {
      url: '/hashtags',
      views: {
        'viewpoint': {
          templateUrl: 'templates/hashtags.html',
          controller: 'HashtagsCtrl'
        }
      }
    })

  .state('messages', {
    url: '/messages',
    views: {
      'viewpoint': {
        templateUrl: 'templates/Messages.html',
        controller: 'Messages'
      }
    }
  });


  $urlRouterProvider.otherwise('/dash');

});
