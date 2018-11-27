myApp.controller("HomeCtrl", function (
  $scope,
  $ionicModal,
  $timeout,
  toastr,
  $http,
  Service,
  jStorageService,
  $location,
  $state,
  $stateParams,
  $rootScope,
  TemplateService
) {
  $scope.bet = false;
  $scope.showBet = function (runner) {
    $scope.betSlipRunner = runner;
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
    if (
      new Date(data.marketStartTime) > new Date() &&
      (data.betfairStatus == "OPEN" || data.isSuspended == "No")
    ) {
      return true;
    } else if (
      new Date(data.marketStartTime) <= new Date() &&
      (data.betfairStatus == "OPEN" ||
        data.isSuspended == "No" ||
        data.inPlayStatus == "Open")
    ) {
      return false;
    } else if (data.betfairStatus != "OPEN" || data.isSuspended == "Yes") {
      return null;
    }
  };
  $scope.$on("$locationChangeSuccess", function () {
    $scope.currentGame = $location.path().split("/");
    console.log("$scope.selectedGame", $scope.currentGame);
    if ($scope.currentGame[1] == "home") {
      $scope.selectedGame = "Cricket";
      $scope.page = "views/content/cricket/cricket.html";
      $scope.getMarketIds({
        game: "Cricket"
      });
    } else {
      $scope.selectedGame = $scope.currentGame[1];
      // $scope.getMarketIds({
      //   game: $scope.currentGame[1],
      //   parentId: $scope.currentGame[2]
      // });
      $scope.getGamePage($scope.currentGame[1]);
    }
  });

  function initiateController() {
    $scope.oneAtATime = true;
    $scope.matches = [];
    $scope.marketData = [];
    $scope.isDraw = true;
    // var path = $location.path().split("/");
    // if (path.length >= 3) {
    //   $scope.currentGame = path[2];
    // }
    // if (path.length >= 4) {
    //   $scope.parentId = path[3];
    // }
    // if (!$scope.currentGame) {
    //   $scope.currentGame = "Cricket";
    //   $scope.selectedGame = "Cricket";
    // } else {
    //   $scope.selectedGame = $scope.currentGame;
    // }
    $scope.currentGame = $location.path().split("/");
    console.log("$scope.selectedGame", $scope.currentGame);
    if ($scope.currentGame[2] == "home") {
      $scope.selectedGame = "Cricket";
      $scope.getMarketIds({
        game: "Cricket"
      });
    }
    // $scope.getGamePage($scope.currentGame);
  }
  $scope.loadingData = true;

  function establishSocketConnection() {
    _.each($scope.marketData, function (market) {
      TemplateService.ratesServerSocket.on(
        "market_" + market.betfairId,
        function onConnect(data) {
          market.allZero = true;
          _.each(market.runners, function (runner) {
            _.each(data.rates, function (rate) {
              if (runner.betfairId == rate.id.toString()) {
                _.each(rate.batb, function (backRate) {
                  if (
                    backRate[0] == 0 &&
                    runner.singleBackRate != backRate[1]
                  ) {
                    runner.singleBackRate = backRate[1];
                    runner.singleBackSize = backRate[2];
                    runner.singleBackRateBlink = true;
                    $timeout(function () {
                      runner.singleBackRateBlink = false;
                    }, 1000);
                  }
                });

                _.each(rate.batl, function (layRate) {
                  if (layRate[0] == 0 && runner.singleLayRate != layRate[1]) {
                    runner.singleLayRate = layRate[1];
                    runner.singleLaySize = layRate[2];
                    runner.singleLayRateBlink = true;
                    $timeout(function () {
                      runner.singleLayRateBlink = false;
                    }, 1000);
                  }
                });
              }
            });
            // runner.singleBackRate = 0;
            // runner.singleLayRate = 0;
            if (runner.singleBackRate > 0 || runner.singleLayRate > 0) {
              market.allZero = false;
            }
          });
          if (data.betfairStatus == "SUSPENDED")
            market.betfairStatus = data.betfairStatus;
          // var sortedArray = _.sortBy(market.runners, ['sortPriority']);
          // market.runners = [];
          // _.each(sortedArray, function (n) {
          //     market.runners[n.sortPriority - 1] = n;
          // });
          $scope.$apply();
        }
      );
    });
  }

  $scope.getMarketIds = function (value) {
    if (value) $scope.loadingData = true;
    if ($state.current.name == "home.inside") {
      if (!_.isEmpty(value.parentId)) {
        value.competitionId = value.parentId;
      }
      delete value.parentId;
    }
    Service.apiCallWithData("Category/getMarketIds", value, function (
      data
    ) {
      if (data.value) {
        $scope.loadingData = false;
        if (!_.isEmpty(data.data)) {
          $scope.loadingData = false;
          $scope.marketData = data.data;
          _.each($scope.marketData, function (market) {
            var sortedArray = _.sortBy(market.runners, ["sortPriority"]);
            market.runners = sortedArray;
            _.each(market.runners, function (runner) {
              _.each(runner.back, function (backRate) {
                if (backRate[0] == 0) {
                  runner.singleBackRate = backRate[1];
                  runner.singleBackSize = backRate[2];
                }
              });
              _.each(runner.lay, function (layRate) {
                if (layRate[0] == 0) {
                  runner.singleLayRate = layRate[1];
                  runner.singleLaySize = layRate[2];
                }
              });
            });
          });
          $scope.home = true;
          $scope.updated = true;
          if (!_.isEmpty($scope.updateMatch)) {
            $scope.updateMatch.pop();
            $scope.getMarketIds({
              game: $scope.selectedGame,
            });
          }
          establishSocketConnection();
          // console.log($scope.marketData);
        } else {
          $scope.marketData = [];
        }
      } else {
        // alert("Unable get markets");
      }
    });
  };
  $scope.updateMatch = [];
  var i = 1;
  TemplateService.sportsBookServerSocket.on(
    "updateMatchStatus",
    function onConnect(data) {
      console.log("updateMatchStatus", data);
      if (data == "updated") {
        if ($scope.updated) {
          $scope.updated = false;
          $scope.getMarketIds({
            game: $stateParams.game,
            parentId: $stateParams.parentId
          });
        } else {
          $scope.updateMatch.push(i);
          i++;
        }
      }
    }
  );
  //Socket for current bet status after winner declared
  TemplateService.sportsBookServerSocket.on(
    "winnerDeclared",
    function onConnect(winnerData) {
      $scope.getMarketIds({
        game: $stateParams.game
      });
    }
  );

  $scope.getDetailedPage = function (game, event, id) {
    $state.go("app.sport", {
      game: game,
      parentId: id
    });
  };

  $scope.format = "yyyy/MM/dd";
  $scope.date = new Date();

  $scope.placeBet = function (price, type, market, selection) {
    var accessToken = jStorageService.getAccessToken();
    var userId = jStorageService.getUserId();

    $rootScope.$broadcast("eventBroadcastedName", {
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
    };
    if (obj.isFavourite == true) {
      obj.status = "Open";
    } else {
      obj.status = "Closed";
    }
    Service.apiCallWithData("FavouriteMatch/saveUserFavourites", obj, function (
      data
    ) {
      if (data.value) {
        if (data.data[1]) {
          _.each($scope.marketData, function (n) {
            if (n._id == data.data[1]._id) {
              n.isFavourite = data.data[1].isFavourite;
            }
          });
        }
      }
    });
  };
  initiateController();
});
