// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var myApp = angular
  .module("starter", [
    "ionic",
    "starter.controllers",
    "ionic-datepicker",
    "starter.services",
    "toastr"
  ])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("app", {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: "AppCtrl"
      })
      .state("app.home", {
        url: "/home",
        views: {
          menuContent: {
            templateUrl: "templates/home/home.html",
            controller: "HomeCtrl"
          }
        }
      })
      .state("app.open-bet", {
        url: "/open-bet",
        views: {
          menuContent: {
            templateUrl: "templates/open-bet/open-bet.html",
            controller: "OpenBetCtrl"
          }
        }
      })
      .state("app.my-market", {
        url: "/my-market",
        views: {
          menuContent: {
            templateUrl: "templates/my-market/my-market.html",
            controller: "MymarketCtrl"
          }
        }
      })
      .state("app.sport", {
        url: "/sport/:game/:parentId",
        views: {
          menuContent: {
            templateUrl: "templates/sport/sport.html",
            controller: "SportCtrl"
          }
        }
      })
      .state("app.competition", {
        url: "/competition",
        views: {
          menuContent: {
            templateUrl: "templates/competition/competition.html",
            controller: "CompetitionCtrl"
          }
        }
      })
      .state("app.racing-page", {
        url: "/racing-page",
        views: {
          menuContent: {
            templateUrl: "templates/racing-page/racing-page.html",
            controller: "RacingPageCtrl"
          }
        }
      })
      .state("app.profit-loss", {
        url: "/profit-loss",
        views: {
          menuContent: {
            templateUrl: "templates/profile-loss/profile-loss.html",
            controller: "ProfitLossCtrl"
          }
        }
      })
      .state("app.profit-loss-inner", {
        url: "/profit-loss-inner",
        views: {
          menuContent: {
            templateUrl: "templates/profit-loss-inner/profit-loss-inner.html",
            controller: "ProfitLossInnerCtrl"
          }
        }
      })
      .state("app.bet-setting", {
        url: "/bet-setting",
        views: {
          menuContent: {
            templateUrl: "templates/bet-setting/bet-setting.html",
            controller: "BetsettingCtrl"
          }
        }
      })
      .state("app.rules-regulations", {
        url: "/rules-regulations",
        views: {
          menuContent: {
            templateUrl: "templates/rules-regulations/rules-regulations.html",
            controller: "RulesRegulationsCtrl"
          }
        }
      })
      .state("app.match-inner", {
        url: "/match-inner",
        views: {
          menuContent: {
            templateUrl: "templates/match-inner/match-inner.html",
            controller: "MatchinnerCtrl"
          }
        }
      })
      .state("app.search", {
        url: "/search",
        views: {
          menuContent: {
            templateUrl: "templates/search/search.html",
            controller: "SearchCtrl"
          }
        }
      })
      .state("login", {
        url: "/login",
        templateUrl: "templates/login/login.html",
        controller: "LoginCtrl"
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise("/login");
  });
