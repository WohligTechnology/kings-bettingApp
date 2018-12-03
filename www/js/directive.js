myApp
  .directive("balance", function () {
    return {
      restrict: "E",
      replace: false,
      scope: {
        balanceData: "=ngBalance"
      },
      templateUrl: "templates/directive/balance.html",
      link: function ($scope, element, attr) {}
    };
  })
  // .directive('market', function () {
  //   return {
  //     restrict: 'E',
  //     replace: false,
  //     scope: {
  //       runners: "=marketRun",
  //       market: "=markets"
  //     },
  //     templateUrl: 'templates/directive/market.html',
  //     link: function ($scope, element, attr) {

  //     }
  //   };
  // })
  // .directive('betForm', function () {
  //   return {
  //     restrict: 'E',
  //     replace: false,
  //     templateUrl: 'templates/directive/bet-form.html',
  //     link: function ($scope, element, attr) {

  //     }
  //   };
  // })
  .directive("marketVolume", function () {
    return {
      restrict: "E",
      replace: false,
      templateUrl: "templates/directive/market-volume.html",
      link: function ($scope, element, attr) {}
    };
  })
  .directive("backButton", function () {
    return {
      restrict: "E",
      replace: false,
      scope: {
        value: "=run",
        market: "=markets"
      },
      templateUrl: "templates/directive/back-button.html",
      link: function ($scope, element, attr) {}
    };
  })
  .directive("layButton", function () {
    return {
      restrict: "E",
      replace: false,
      scope: {
        value: "=run",
        market: "=markets"
      },
      templateUrl: "templates/directive/lay-button.html",
      link: function ($scope, element, attr) {}
    };
  })
  .directive("myBets", function (TemplateService, Service, ionicToast,
    $stateParams) {
    return {
      restrict: "E",
      replace: false,
      templateUrl: "templates/directive/my-bets.html",
      link: function ($scope, element, attr, ) {
        var user = $.jStorage.get("userId");
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


        $scope.getMyCurrentBetStatus = function () {
          $scope.matchedFilter = "Order By Date";
          Service.apiCallWithData(
            "bet/getMyCurrentBetStatus", {
              playerId: user
            },
            function (betData) {
              if (betData.value) {
                $scope.myCurrentBetData = betData.data;
                if ($stateParams.parentId) {
                  _.remove($scope.myCurrentBetData.unMatchedbets, function (unMatchedbets) {
                    return unMatchedbets.betData[0].parentCategory !== $stateParams.parentId;
                  });
                  _.remove($scope.myCurrentBetData.matchedBets, function (matchedBets) {
                    return matchedBets.betData[0].parentCategory !== $stateParams.parentId;
                  });
                }
              }
            }
          );
        };

        //initial socket
        TemplateService.sportsBookServerSocket.on(
          "player_" + user,
          function onConnect(myCurrentBetData) {
            $scope.myCurrentBetData = myCurrentBetData;
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
      }
    };
  })
  .directive("displaynumber", function ($http, $filter) {
    return {
      templateUrl: "templates/directive/display-number.html",
      scope: {
        model: "=ngModel"
        // decimal: '=decimal'
      },
      link: function ($scope, element, attrs) {
        // $scope.decimal = $scope.decimal ? $scope.decimal : 2;
      }
    };
  })
  .directive("searchEvent", function () {
    return {
      restrict: "E",
      replace: false,
      templateUrl: "templates/directive/search.html",
      link: function ($scope, element, attr) {}
    };
  });
