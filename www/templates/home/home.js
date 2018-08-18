myApp.controller('HomeCtrl', function ($scope, $ionicModal, $timeout) {
  //   showSearch = false;
  //   $scope.showSearch = function () {
  //     showSearch = true;
  //   }
  $scope.bet = false;
  $scope.showBet = function () {
    $scope.bet = !$scope.bet
  }
})
