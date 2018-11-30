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
  var user = $.jStorage.get("userId");
  $scope.liability = 0;
  $scope.profit = 0;
  $scope.profits = [];

  Service.apiCallWithUrl(
    mainServer + "api/member/getOne", {
      _id: user
    },
    function (data) {
      $scope.memberMinRate = data.data.minRate[0].memberMinRate;
      $scope.username = data.data.username;
    }
  );
  $scope.bet = false;
  var accessToken = $.jStorage.get("accessToken");
  var userid = $.jStorage.get("userId");
  $scope.showBet = function (market, runner, type) {
    $scope.liability = 0;
    $scope.minBetError = false;
    // $scope.betSlipRunner = runner;
    $scope.betSlipRunner = {
      odds: type == "BACK" ? runner.singleBackRate : runner.singleLayRate,
      type: type,
      eventId: market.parentCategory.betfairId,
      event: market.eventName,
      selectionId: runner.betfairId,
      selectionName: runner.name,
      sport: "Cricket",
      marketId: market.betfairId,
      accessToken: accessToken,
      marketName: market.name,
      userId: userid,
      handicap: runner.handicap
    };
    console.log($scope.betSlipRunner);
  };
  $scope.cancelBet = function () {
    $scope.betSlipRunner = {};
  };

  $scope.incOrDec = function (num, event, type) {
    var num2 = 0;
    if ((event.keyCode == 38 || event == "up") && num < 1000) {
      if (num >= 1.01 && num < 5) {
        num2 = 0.01;
      } else if (num >= 5 && num < 10) {
        num2 = 0.1;
      } else if (num >= 10 && num < 20) {
        num2 = 0.5;
      } else if (num >= 20 && num < 30) {
        num2 = 1;
      } else if (num >= 30 && num < 50) {
        num2 = 2;
      } else if (num >= 50 && num < 100) {
        num2 = 5;
      } else if (num >= 100 && num < 1000) {
        num2 = 10;
      }
      num = num + num2;
      num = +(Math.round(num + "e+2") + "e-2");
    } else if ((event.keyCode == 40 || event == "down") && num > 1.01) {
      if (num > 1.01 && num <= 5) {
        num2 = 0.01;
      } else if (num > 5 && num <= 10) {
        num2 = 0.1;
      } else if (num > 10 && num <= 20) {
        num2 = 0.5;
      } else if (num > 20 && num <= 30) {
        num2 = 1;
      } else if (num > 30 && num <= 50) {
        num2 = 2;
      } else if (num > 50 && num <= 100) {
        num2 = 5;
      } else if (num > 100 && num <= 1000) {
        num2 = 10;
      }
      num = num - num2;
      num = +(Math.round(num + "e+2") + "e-2");
    }
    $scope.calculatePL(type);
    return num;
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
      Service.apiCallWithData(
        "Book/getUserBook", {
          marketId: market.betfairId,
          user: user
        },
        function (bookInfo) {
          if (bookInfo.value) {
            market.bookInfo = bookInfo.data.horse;
            market.userRate = bookInfo.data.userRate;
            $scope.calculatePlacedBookAmt();
          }
        }
      );
      // console.log("Book_" + market.betfairId + "_" + user);
      TemplateService.sportsBookServerSocket.on(
        "Book_" + market.betfairId + "_" + user,
        function onConnect(bookData) {
          console.log(
            "user book socket data**************** //////////////////////",
            bookData
          );
          market.bookInfo = bookData.horse;
          market.userRate = bookData.userRate;
          $scope.calculatePlacedBookAmt();
        }
      );
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
    Service.apiCallWithData("Category/getMarketIds", value, function (data) {
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
              game: $scope.selectedGame
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
  $scope.calculatePL = function (type) {
    // var userInfo = jStorageService.getUserData();
    // if (userInfo.minRate && userInfo.minRate[0].memberMinRate) {
    //   $scope.memberMinRate = userInfo.minRate[0].memberMinRate;
    // }
    $scope.minBetError = false;
    // if ($scope.myCurrentBetData && $scope.myCurrentBetData.unMatchedbets) {
    //   _.each($scope.myCurrentBetData.unMatchedbets, function (unMatchedbets) {
    //     _.each(unMatchedbets.betData, function (bet) {
    //       if (bet.type == "BACK") {
    //         bet.profit =
    //           bet.betRate && bet.stake ? (bet.betRate - 1) * bet.stake : 0;
    //       } else {
    //         bet.liability =
    //           bet.betRate && bet.stake ? (bet.betRate - 1) * bet.stake : 0;
    //       }
    //       bet.updatedodds = bet.betRate - 1;
    //       if (!bet.stake || bet.stake >= $scope.memberMinRate) {
    //         bet.error = false;
    //       } else {
    //         bet.error = true;
    //         $scope.minBetError = true;
    //       }
    //     });
    //   });
    //   $scope.checkChangeInBet();
    // }
    if (type == "LAY") {
      // _.each($scope.layArray, function (n) {
      //   n.liability = n.odds && n.stake ? (n.odds - 1) * n.stake : 0;
      //   n.updatedodds = n.odds - 1;
      //   if (!n.stake || n.stake >= $scope.memberMinRate) {
      //     n.error = false;
      //   } else {
      //     n.error = true;
      //     $scope.minBetError = true;
      //   }
      // });
      $scope.betSlipRunner.liability =
        $scope.betSlipRunner.odds && $scope.betSlipRunner.stake ?
        ($scope.betSlipRunner.odds - 1) * $scope.betSlipRunner.stake :
        0;
      if (
        !$scope.betSlipRunner.stake ||
        $scope.betSlipRunner.stake >= $scope.memberMinRate
      ) {
        $scope.betSlipRunner.error = false;
      } else {
        $scope.betSlipRunner.error = true;
        $scope.minBetError = true;
      }
      $scope.betSlipRunner.updatedodds = $scope.betSlipRunner.odds - 1;
    }

    if (type == "BACK") {
      // _.each($scope.backArray, function (n) {
      //   n.profit = n.odds && n.stake ? (n.odds - 1) * n.stake : 0;
      //   n.updatedodds = n.odds - 1;
      //   if (n.stake >= $scope.memberMinRate) {
      //     n.error = false;
      //   } else {
      //     n.error = true;
      //     $scope.minBetError = true;
      //   }
      // });
      $scope.betSlipRunner.profit =
        $scope.betSlipRunner.odds && $scope.betSlipRunner.stake ?
        ($scope.betSlipRunner.odds - 1) * $scope.betSlipRunner.stake :
        0;
      if (
        !$scope.betSlipRunner.stake ||
        $scope.betSlipRunner.stake >= $scope.memberMinRate
      ) {
        $scope.betSlipRunner.error = false;
      } else {
        $scope.betSlipRunner.error = true;
        $scope.minBetError = true;
      }
      $scope.betSlipRunner.updatedodds = $scope.betSlipRunner.odds - 1;
    }
    // $scope.liability =
    //   _.sumBy($scope.layArray, "liability") +
    //   _.sumBy($scope.backArray, "stake");

    // if ($state.current.name == "home.detailPage") {
    $rootScope.calculateBook($scope.betSlipRunner);
    // }
  };

  $rootScope.calculateBook = function (value) {
    $scope.unexecutedProfit = [];
    _.forEach($scope.marketData, function (market, marketIndex) {
      market.book = [];
      if (value.marketId == market.betfairId) {
        market.book.push(value);
      }
      _.each(market.runners, function (runner) {
        delete runner.unexecutedProfit;
        _.each(market.book, function (book) {
          if (book.type == "LAY") {
            if (book.selectionId == runner.betfairId) {
              if (runner.unexecutedProfit) {
                runner.unexecutedProfit =
                  runner.unexecutedProfit + book.liability * -1;
              } else {
                runner.unexecutedProfit = -1 * book.liability;
              }
            } else {
              if (runner.unexecutedProfit) {
                runner.unexecutedProfit = runner.unexecutedProfit + book.stake;
              } else {
                runner.unexecutedProfit = book.stake;
              }
            }
          } else if (book.type == "BACK") {
            if (book.selectionId == runner.betfairId) {
              if (runner.unexecutedProfit) {
                runner.unexecutedProfit = runner.unexecutedProfit + book.profit;
              } else {
                runner.unexecutedProfit = book.profit;
              }
            } else {
              if (runner.unexecutedProfit) {
                runner.unexecutedProfit =
                  runner.unexecutedProfit + book.stake * -1;
              } else {
                runner.unexecutedProfit = book.stake * -1;
              }
            }
          }
        });
        _.each($scope.profits[marketIndex], function (m) {
          if (
            m.betfairId == runner.betfairId &&
            runner.unexecutedProfit &&
            m.amount
          ) {
            runner.unexecutedProfit = m.amount + runner.unexecutedProfit;
          }
        });
      });

      $scope.unexecutedProfit.push(market.runners);
    });
  };
  $scope.betConfirm = function () {
    $scope.betPlacing = true;
    if ($scope.userConfigData.confirmStatus) {
      $scope.openConfirmBet();
    } else {
      $scope.placeBet();
    }
  };
  $scope.placeBet = function () {
    // $timeout(function () {
    //   $scope.showTimer = true;
    //   $scope.countdown = 5;
    //   $scope.clickButton();
    // }, 1000);
    // toastrConfig = {};
    // toastrConfig.positionClass = "toast-top-right";
    // toastr.success("Your Bet will submit in 5 seconds");
    if (
      !$scope.userConfigData.oneClickStatus &&
      $scope.userConfigData.confirmStatus
    ) {
      $scope.betconfirm.close();
    }
    // $scope.promise = NavigationService.success().then(function () {
    // var reqData = _.concat($scope.layArray, $scope.backArray);
    var reqData = [];
    reqData.push($scope.betSlipRunner);
    Service.apiCallWithData("Betfair/placePlayerBetNew", reqData, function (
      data
    ) {
      // $scope.betPlacing = false;
      // $timeout(function () {
      //   $scope.showTimer = false;
      // }, 500);

      if (data.value) {
        // toastr.success("Bet Placed successfully!");
        // $scope.activePill = 1;
        // $scope.removeAllBets();
        // $scope.getMyCurrentBetStatus();
      } else {
        // if (data.error == "MIN_BET_STAKE_REQUIRED") {
        //   toastr.error("Please increase stake amount");
        // } else {
        //   toastr.error("Error while placing Bet");
        // }
      }
    });
    // });
  };
  $scope.calculatePlacedBookAmt = function () {
    $scope.profits = [];
    _.each($scope.marketData, function (market) {
      _.each(market.runners, function (runner) {
        _.each(market.bookInfo, function (horse) {
          if (runner.betfairId == horse.horse) {
            runner.amount = horse.amount / market.userRate;
          }
        });
      });
      $scope.profits.push(market.runners);
      // $scope.unexecutedProfit = [];
      // $scope.$apply();
    });
  };
  //Modal Confirm
  $ionicModal
    .fromTemplateUrl("templates/modal/confirmbet.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function (modal) {
      $scope.ConfirmBetModal = modal;
    });

  $scope.openConfirmBet = function () {
    $scope.ConfirmBetModal.show();
  };
  $scope.closeConfirmBet = function () {
    $scope.ConfirmBetModal.hide();
  };
});
