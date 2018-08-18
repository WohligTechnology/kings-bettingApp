myApp.controller('MatchinnerCtrl', function ($scope, $ionicModal, $timeout) {

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
  $scope.bet = false;
  $scope.showBet = function () {
    $scope.bet = !$scope.bet
  }

  //code for modal
  $ionicModal.fromTemplateUrl('templates/modal/confirmbet.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.confirmbet = modal;
  });
  $scope.confirmbetShow = function () {
    $scope.confirmbet.show();
  };
  $scope.confirmbetHide = function () {
    $scope.confirmbet.hide();
  };
})
