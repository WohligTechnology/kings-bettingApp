myApp.controller('ProfitLossInnerCtrl', function ($scope, $ionicModal, $timeout) {
  var memberId = jStorageService.getUserId();
  $scope.bettingPl = function (value) {
    $scope.formData.memberId = memberId;
    if (!_.isEmpty(value)) {
      $scope.formData.subGame = value;
    } else {
      delete $scope.formData.subGame;
    }
    $scope.formData.fromDate = new Date(new Date($scope.formData.fromDate).setHours(0, 0, 0, 0));
    $scope.formData.toDate = new Date(new Date($scope.formData.toDate).setHours(0, 0, 0, 0));
    Service.bettingPl($scope.formData, function (data) {
      $scope.isDetailedView = false;
      if (data.value) {
        $scope.bettingPldata = data.data.accounts;
        // _.each(data.data.gameWiseNetProfit, function (n) {
        //   if (n._id == "Cricket") {
        //     $scope.eventTypeData[0] = n;
        //   }
        //   if (n._id == "Soccer") {
        //     $scope.eventTypeData[1] = n;
        //   }
        //   if (n._id == "Tennis") {
        //     $scope.eventTypeData[2] = n;
        //   }
        //   if (n._id == "Horse Racing") {
        //     $scope.eventTypeData[3] = n;
        //   }
        //   if (n._id == "Greyhound Racing") {
        //     $scope.eventTypeData[4] = n;
        //   }
        // });
        $scope.totalPL = data.data.netProfit;
      } else {
        $scope.bettingPldata = [];
        $scope.eventTypeData = [];
        $scope.totalPL = "";
      }

    });

  };
  $scope.bettingPl({});

});
