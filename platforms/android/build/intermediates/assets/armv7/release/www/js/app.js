angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
.constant('Debug', true)
.constant('URL', 'https://voxxeddaysticino2015.sched.org/')
.constant('appversion', 1)

.constant('ApiEndpoint', {
  //url: 'http://192.168.8.100:8100/api'
  url: 'http://voxxeddaysticino2015.sched.org/api'
})

.run(function($ionicPlatform, Speakers) {
  $ionicPlatform.ready(function() {
    
    Speakers.fetch();

    //Enable native scrolling
    if(!ionic.Platform.isIOS())$ionicConfigProvider.scrolling.jsScrolling(false);

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.sessions', {
    url: "/sessions",
    views: {
      'menuContent': {
        templateUrl: "templates/sessions.html",
	controller: "SessionsCtrl"
      }
    }
  })
  .state('app.credits', {
    url: "/credits",
    views: {
      'menuContent': {
        templateUrl: "templates/credits.html"
      }
    }
  })
  .state('app.sessions_type', {
    url: "/sessions_type/:type",
    views: {
      'menuContent': {
        templateUrl: "templates/sessions.html",
	controller: "TypeCtrl"
      }
    }
  })
    .state('app.speakers', {
      url: "/speakers",
      views: {
        'menuContent': {
          templateUrl: "templates/speakers.html",
          controller: 'SpeakersCtrl'
        }
      }
    })

  .state('app.sess_single', {
    url: "/session/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/detail_session.html",
        controller: 'SessionCtrl'
      }
    }
  })
  .state('app.sp_single', {
    url: "/speaker/:name",
    views: {
      'menuContent': {
        templateUrl: "templates/detail_speaker.html",
        controller: 'SpeakerCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/sessions');
});
