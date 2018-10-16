angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicSideMenuDelegate, $interval, $state, Service, jStorageService) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal

    $scope.loginData = {};

    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.$on('$ionicView.leave', function () {
      $ionicSideMenuDelegate.canDragContent(false);
    });

    var user = jStorageService.getUserId();

    var tick = function () {
      $scope.clock = Date.now();
    }
    tick();
    $interval(tick, 1000);
    if (!$.jStorage.get("accessToken")) {
      $state.go('login');
    }
    if ($.jStorage.get("userId")) {
      Service.userGetOne({
        _id: $.jStorage.get("userId")
      }, function (userData) {
        console.log(userData);
        $scope.userInfo = userData.data;
      })
    }


    //logout
    $scope.logout = function () {
      $.jStorage.flush();
      $state.go('login');
    };

    $scope.home = true;

    // $scope.visitedCategories = [];
    $scope.previousState = [];
    //To get games
    $scope.getGames = function () {
      Service.apiCallWithData('Category/getCategoriesForNavigation', {}, function (data) {
        // console.log(data);
        if (data.value) {
          if (!_.isEmpty(data.data)) {
            $scope.gameData = data.data;
            // console.log("$scope.gameData >>>>>>>>>>>>", $scope.gameData);
            // console.log("$scope.gameData", $scope.gameData);
            // $scope.visitedCategories.push($scope.gameData);
            // $scope.setUrl('game', '1');
            $scope.home = true;
          } else {
            $scope.gameData = [];
          }
        } else {
          alert("Unable get games");
        }
      });
    };
    $scope.getGames();

    //     });
    // };

    // //To get sub Category
    $scope.getSubCategory = function (value) {


      //get match odds on click
      // $scope.getMatchOdds({
      //     game: $scope.game,
      //     parentId: $scope.parentId
      // });

      if (!_.isEmpty(value)) {
        $state.go('homeInside', {
          game: $scope.game,
          parentId: $scope.parentId
        }, {
          notify: false
        });
        if (!$scope.next) {
          $scope.next = true;
          $scope.previous = false;
        } else {
          $scope.next = false;
          $scope.previous = true;
        }
        $scope.home = false;

        // $scope.previous = false;
        if (!_.isEmpty($scope.subcategory)) {
          $scope.previousState.push($scope.subcategory);
        }

        $scope.subcategory = value;
      } else {
        // $state.go("detailPage", {
        //   game: $scope.game,
        //   parentId: $scope.parentId
        // });
      }
    };

    $scope.getGameName = function (value) {
      $scope.game = value;
    };

    $scope.getParentId = function (value) {
      $scope.previousParentId = $scope.parentId;
      $scope.parentId = value;
    }


    $scope.getPreviousCategory = function () {
      if (!_.isEmpty($scope.previousState)) {
        if (!$scope.next) {
          $scope.next = true;
          $scope.previous = false;
        } else {
          $scope.next = false;
          $scope.previous = true;
        }
        $scope.subcategory = $scope.previousState[$scope.previousState.length - 1];
        $scope.parentId = $scope.previousParentId;
        $scope.previousState.pop();
        $state.go('homeInside', {
          game: $scope.game,
          parentId: $scope.parentId
        }, {
          notify: false
        });
        // $scope.getMatchOdds({
        //     game: $scope.game,
        //     parentId: $scope.parentId
        // });
      } else {
        $scope.subcategory = [];
        $scope.previousState = [];
        $scope.home = true;
        $scope.next = false;
        $scope.previous = false;
        $state.go('home', {
          notify: false
        });
        // $scope.getMatchOdds({
        //     game: "Cricket"
        // });
      };
    };

    // //Go to home menu
    $scope.goTohome = function () {
      $scope.subcategory = [];
      $scope.previousState = [];
      $scope.home = true;
      $scope.next = false;
      $scope.previous = false;
      $state.go('home', {
        notify: false
      });
    };

    $scope.searchEvent = function (value) {
      Service.apiCallWithData('category/searchEvent', {
        searchText: value
      }, function (data) {
        $scope.searchData = data.data;
      });
    };

    // $scope.getDetailedEvent = function (item) {
    //   $state.go("detailPage", {
    //     game: item.eventType.name,
    //     parentId: item._id
    //   });
    // };

    $scope.getAvailableCredit = function () {
      Service.apiCallWithUrl(mainServer + 'api/sportsbook/getCurrentBalance', {
          _id: user
        },
        function (balanceData) {
          if (balanceData.value) {
            $scope.balanceData = balanceData.data;
          }
        });
      Service.apiCallWithUrl(mainServer + 'api/netExposure/getMemberNetExposure', {
          _id: user
        },
        function (netExposureData) {
          if (netExposureData.value) {
            console.log("netExposureData!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", netExposureData);
            $scope.netExposureData = netExposureData.data.netExposure ? (netExposureData.data.netExposure * -1) : 0;
            console.log("$scope.netExposureData##########################", $scope.netExposureData);
          }
        });
      $scope.mySocket1 = io.sails.connect(mainServer);
      console.log("getAvailableCredit", user);

      $scope.mySocket1.on("Balance_" + user, function onConnect(balanceData) {
        $scope.balanceData = balanceData;
        $scope.$apply();
      });
      $scope.mySocket1.on("NetExposure_" + user, function onConnect(netExposureData) {
        $scope.netExposureData = netExposureData.netExposure ? (netExposureData.netExposure * -1) : 0;
        console.log("$scope.netExposureData22222222222222222222222", $scope.netExposureData);
        $scope.$apply();
      })
    }
    $scope.getAvailableCredit();
  });
