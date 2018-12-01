myApp.controller("SportCtrl", function (
  $scope,
  $ionicModal,
  $stateParams,
  Service
) {
  $scope.game = $stateParams.game;
  $scope.getGames = function () {
    Service.apiCallWithData(
      "Category/getCategoriesForNavigation", {},
      function (data) {
        if (data.value) {
          if (!_.isEmpty(data.data)) {
            $scope.gameData = data.data;
            $scope.subcategory = _.find($scope.gameData, function (game) {
              return game.name == $stateParams.game;
            }).children;
          } else {
            $scope.gameData = [];
          }
        }
      }
    );
  };
  $scope.getGames();
  // //To get sub Category
  $scope.getSubCategory = function (value) {
    if (!_.isEmpty(value.children)) {
      $scope.subcategory = value.children;
    }
  };

});
