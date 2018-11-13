myApp.controller('ProfitLossInnerCtrl', function ($scope, $ionicModal, $timeout,jStorageService,Service) {
  // var memberId = jStorageService.getUserId();
  var memberId = "5bac6e0afe33926b6c239d7d";
  $scope.formData={};

  $scope.getEventBetsDetails = function (eventType, event, market, marketId, commissionAmt) {
    $scope.eventType = eventType;
    $scope.event = event;
    $scope.market = market;
    $scope.commissionAmt = commissionAmt;
    $scope.type1 = 0;
    $scope.type2 = 0;
    NavigationService.apiCallWithData('bet/getBetPLPerEvent', {
      marketId: marketId,
      memberId: memberId
    }, function (data) {
      $scope.isDetailedView = true;
      $scope.eventBetsData = data.data;
      _.each($scope.eventBetsData, function (n) {
        if (n.type == "BACK" || n.type == "YES") {
          if (n.betData.betWinStatus == "WON") {
            n.amt = (n.betRate - 1) * n.stake;
          } else {
            n.amt = n.stake * (-1);
          }
          $scope.type1 = $scope.type1 + n.amt;
        } else if (n.type == "LAY" || n.type == "NO") {
          if (n.betData.betWinStatus == "WON") {
            n.amt = n.stake
          } else {
            n.amt = ((n.betRate - 1) * n.stake) * (-1);
          }
          $scope.type2 = $scope.type2 + n.amt;
        }
      });

      $scope.marketSubTotal = $scope.type1 + $scope.type2;
      if ($scope.marketSubTotal > 0) {
        $scope.netMarketTotal = $scope.marketSubTotal - $scope.commissionAmt;
      } else {
        $scope.netMarketTotal = $scope.marketSubTotal;
      }
    });
  };
});
