myApp.controller('OpenBetCtrl', function ($scope, $ionicModal, $timeout, TemplateService, Service, ionicToast) {
  var user = $.jStorage.get("userId");
  //Accordian Code
  $scope.groups = [];
  for (var i = 0; i < 2; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j = 0; j < 2; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function (group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function (group) {
    return $scope.shownGroup === group;
  };

  $scope.resetBet = function () {
    if ($scope.myCurrentBetData && $scope.myCurrentBetData.unMatchedbets) {
      _.forEach($scope.myCurrentBetData.unMatchedbets, function (unMatchedbet) {
        _.forEach(unMatchedbet.betData, function (bet) {
          bet.betRate = bet.oldBetRate;
          bet.stake = bet.oldStake;
        });
      });
    }
    $scope.changeInBet = false;
  };

  $scope.manageCurrentBet = function () {
    if ($scope.myCurrentBetData && $scope.myCurrentBetData.matchedBets) {
      $scope.averageMatchedbets = _.cloneDeep(
        $scope.myCurrentBetData.matchedBets
      );
      _.forEach($scope.averageMatchedbets, function (event) {
        event.horse = [];
        _.forEach(event.betData, function (bet) {
          var horseIndex = _.findIndex(event.horse, function (horse) {
            return horse.name == bet.horse;
          });
          if (horseIndex == -1) {
            event.horse.push({
              name: bet.horse,
              back: {
                betRate: 0,
                stake: 0,
                count: 0
              },
              backArray: [],
              lay: {
                betRate: 0,
                stake: 0,
                count: 0
              },
              layArray: []
            });
            horseIndex = event.horse.length - 1;
          }
          if (bet.type == "BACK") {
            var backIndex = _.findIndex(
              event.horse[horseIndex].backArray,
              function (back) {
                return back.betRate == bet.betRate;
              }
            );
            if (backIndex == -1) {
              event.horse[horseIndex].backArray.push({
                betRate: bet.betRate,
                stake: bet.stake,
                count: 1
              });
            } else {
              event.horse[horseIndex].backArray[backIndex].stake += bet.stake;
              event.horse[horseIndex].backArray[backIndex].count++;
            }
            event.horse[horseIndex].back.betRate += bet.betRate;
            event.horse[horseIndex].back.stake += bet.stake;
            event.horse[horseIndex].back.count++;
          }
          if (bet.type == "LAY") {
            var layIndex = _.findIndex(
              event.horse[horseIndex].layArray,
              function (back) {
                return back.betRate == bet.betRate;
              }
            );
            if (layIndex == -1) {
              event.horse[horseIndex].layArray.push({
                betRate: bet.betRate,
                stake: bet.stake,
                count: 1
              });
            } else {
              event.horse[horseIndex].layArray[layIndex].stake += bet.stake;
              event.horse[horseIndex].layArray[layIndex].count++;
            }
            event.horse[horseIndex].lay.betRate += bet.betRate;
            event.horse[horseIndex].lay.stake += bet.stake;
            event.horse[horseIndex].lay.count++;
          }
        });
      });
    }
    if ($scope.myCurrentBetData && $scope.myCurrentBetData.unMatchedbets) {
      _.forEach($scope.myCurrentBetData.unMatchedbets, function (unMatchedbet) {
        unMatchedbet.cancel = false;
        _.forEach(unMatchedbet.betData, function (bet) {
          bet.cancel = false;
          bet.oldBetRate = bet.betRate;
          bet.oldStake = bet.stake;
        });
      });
    }
    $scope.status = {
      unmatchedOpen: $scope.myCurrentBetData.unMatchedbets.length > 0,
      matchedOpen: $scope.myCurrentBetData.matchedBets.length > 0
    };
    $scope.checkChangeInBet();
  };
  $scope.checkChangeInBet = function () {
    $scope.changeInBet = false;
    if ($scope.myCurrentBetData && $scope.myCurrentBetData.unMatchedbets) {
      _.forEach($scope.myCurrentBetData.unMatchedbets, function (unMatchedbet) {
        _.forEach(unMatchedbet.betData, function (bet) {
          if (bet.oldBetRate !== bet.betRate) {
            $scope.changeInBet = true;
          }
          if (bet.oldStake !== bet.stake) {
            $scope.changeInBet = true;
          }
        });
      });
    }
  };
  $scope.getMyCurrentBetStatus = function () {
    $scope.matchedFilter = "Order By Date";
    Service.apiCallWithData(
      "bet/getMyCurrentBetStatus", {
        playerId: user
      },
      function (betData) {
        if (betData.value) {
          $scope.myCurrentBetData = betData.data;
          $scope.cancelAll = false;
          $scope.manageCurrentBet();
        }
      }
    );
  };

  //initial socket
  TemplateService.sportsBookServerSocket.on(
    "player_" + user,
    function onConnect(myCurrentBetData) {
      $scope.myCurrentBetData = myCurrentBetData;
      $scope.manageCurrentBet();
      $scope.$apply();
    }
  );
  //Socket for current bet status
  TemplateService.sportsBookServerSocket.on(
    "BetExecuted_" + user,
    function onConnect(data) {
      $scope.getMyCurrentBetStatus();
    }
  );

  //Socket for current bet status after winner declared
  TemplateService.sportsBookServerSocket.on(
    "winnerDeclared",
    function onConnect(winnerData) {
      $scope.getMyCurrentBetStatus();
      $scope.$apply();
    }
  );
  $scope.getMyCurrentBetStatus();
  $scope.cancelBet = function (betArray, level) {
    var reqData = [];
    reqData.push({
      playerId: user,
      betId: betArray.betId
    });
    Service.apiCallWithData(
      "Betfair/cancelPlayerBetNew",
      reqData,
      function (data) {
        if (data.value) {
          $scope.getMyCurrentBetStatus();
          // toastr.success("Bet cancelled successfully");
          ionicToast.show("Bet cancelled successfully");
        } else {
          // toastr.error("Error while cancelling Bet");
          ionicToast.show("Error while cancelling Bet");
        }
      }
    );
  };
})
