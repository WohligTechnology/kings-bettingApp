myApp.controller('MymarketCtrl', function ($scope, $ionicModal, $timeout, Service) {


  $scope.getMyMarket = function () {
    $scope.loadingData = true;
    var user = $.jStorage.get("userId");
    Service.apiCallWithData(
      "category/getMyMarket", {
        user: user
      },
      function (data) {
        if (data.value) {
          $scope.myMarkets = data.data;
          $scope.loadingData = false;
        } else {
          $scope.myMarkets = [];
          $scope.loadingData = false;
        }
      }
    );
  };

  $scope.getMyMarket();
})
