myApp.controller('MatchinnerCtrl', function ($scope, $ionicModal, $timeout) {

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
  $scope.bet = false;
  $scope.showBet = function () {
    $scope.bet = !$scope.bet
  }

})
