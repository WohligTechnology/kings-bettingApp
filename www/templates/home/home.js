myApp.controller('HomeCtrl', function ($scope, $ionicModal, $timeout, toastr, $http,Service,jStorageService, $location, $state, $stateParams, $rootScope) {
  $scope.bet = false;
  $scope.showBet = function () {
    $scope.bet = !$scope.bet;
  };

  //home
  $scope.getGamePage = function (value) {
    switch (value) {
      case "Greyhound Racing":
        $scope.page = "templates/cricket/cricket.html";
        break;
      case "Horse Racing":
        $scope.page = "templates/tennis/tennis.html";
        break;
      case "Tennis":
        $scope.page = "templates/cricket/cricket.html";
        $scope.isDraw = false;
        break;

      default:
        $scope.page = "templates/cricket/cricket.html";
    }
  };

  $scope.checkDate = function (data) {
    if (new Date(data.marketStartTime) > new Date() && (data.betfairStatus == "OPEN" || data.isSuspended == "No")) {
      return true;
    } else if (new Date(data.marketStartTime) <= new Date() && (data.betfairStatus == "OPEN" || data.isSuspended == "No" || data.inPlayStatus == "Open")) {
      return false;
    } else if (data.betfairStatus != "OPEN" || data.isSuspended == "Yes") {
      return null;
    }
  }

  $scope.$on('$locationChangeSuccess', function () {
    $scope.currentGame = ($location.path()).split('/');
    console.log("$scope.selectedGame", $scope.currentGame);
    if ($scope.currentGame[1] == "home") {
      $scope.selectedGame = "Cricket";
      $scope.page = "views/content/cricket/cricket.html";
      // $scope.getMarketIds({
      //   game: "Cricket"
      // });
    } else {
      $scope.selectedGame = $scope.currentGame[1];
      // $scope.getMarketIds({
      //   game: $scope.currentGame[1],
      //   parentId: $scope.currentGame[2]
      // });
      $scope.getGamePage($scope.currentGame[1]);
    }
  });

  function establishSocketConnection() {
    $scope.mySocket1 = io.sails.connect(adminUUU);

    _.each($scope.marketData, function (market) {
      $scope.mySocket1.on("market_" + market.betfairId, function onConnect(data) {
        // console.log("socket data", data);
        _.each(market.runners, function (runner) {
          _.each(data, function (rate) {
            // console.log(runner.betfairId, "string", (rate.id).toString());
            if (runner.betfairId == (rate.id).toString()) {
              runner.back = rate.batb;
              runner.lay = rate.batl;
              _.each(runner.back, function (backRate) {
                if (backRate[0] == 0) {
                  runner.singleBackRate = backRate[1];
                  runner.singleBackSize = backRate[2]
                }
              });

              _.each(runner.lay, function (layRate) {
                if (layRate[0] == 0) {
                  runner.singleLayRate = layRate[1];
                  runner.singleLaySize = layRate[2]
                }
              });
            }
          });
        });
        var sortedArray = _.sortBy(market.runners, ['sortPriority']);
        market.runners = [];
        _.each(sortedArray, function (n) {
          market.runners[n.sortPriority - 1] = n;
        });
        // console.log("sortedArray", sortedArray);
        // console.log(market.betfairId + "marketodds", market);
        $scope.$apply();
      });
    })

  };

  // $scope.getMarketIds = function (value) {
  //   Service.apiCallWithData('Category/getMarketIds', value, function (data) {
  //     if (data.value) {
  //       if (!_.isEmpty(data.data)) {
  //         $scope.marketData = data.data;
  //         // $scope.marketId = "market_1.144792630";
  //         // console.log("$scope.marketData", $scope.marketData);
  //         // $scope.setUrl('game', '1');
  //         $scope.home = true;
  //         establishSocketConnection();
  //       } else {
  //         $scope.marketData = [];
  //       }
  //     } else {
  //       // alert("Unable get markets");
  //     }
  //   });
  // };

  $scope.getDetailedPage = function (game, event, id) {
    $state.go("detailPage", {
      game: game,
      parentId: id
    });
  };



  $scope.format = 'yyyy/MM/dd';
  $scope.date = new Date();

  $scope.placeBet = function (price, type, market, selection) {
    var accessToken = jStorageService.getAccessToken();
    var userId = jStorageService.getUserId();

    $rootScope.$broadcast('eventBroadcastedName', {
      odds: price,
      type: type,
      eventId: market.parentCategory.betfairId,
      event: market.parentCategory.name,
      selectionId: selection.betfairId,
      selectionName: selection.name,
      sport: $scope.selectedGame,
      marketId: market.betfairId,
      accessToken: accessToken,
      userId: userId
    });
  };


  $scope.saveFavourite = function (value, isFavourite) {
    var userId = jStorageService.getUserId();
    console.log("favourites clicked", value, isFavourite);

    var obj = {
      marketId: value.betfairId,
      marketMongoId: value._id,
      game: $scope.selectedGame,
      parentId: value.parentCategory._id,
      marketStartTime: value.marketStartTime,
      user: userId,
      isFavourite: !value.isFavourite
    }
    if (obj.isFavourite == true) {
      obj.status = "Open";
    } else {
      obj.status = "Closed";
    }
    Service.apiCallWithData('FavouriteMatch/saveUserFavourites', obj, function (data) {
      if (data.value) {
        if (data.data[1]) {
          _.each($scope.marketData, function (n) {
            if (n._id == data.data[1]._id) {
              n.isFavourite = data.data[1].isFavourite
            }
          });
        }
      }
    });
  }

})
