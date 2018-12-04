myApp.controller("SportCtrl", function (
  $scope,
  $stateParams,
  Service,
  $state
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
            if ($stateParams.parentIndex) {
              $scope.parent = $scope.subcategory[$stateParams.parentIndex].name;
              $scope.subcategory = $scope.subcategory[$stateParams.parentIndex].children
            }
          } else {
            $scope.gameData = [];
          }
        }
      }
    );
  };
  $scope.getGames();
  // //To get sub Category
  $scope.getSubCategory = function (value, index) {
    if (!_.isEmpty(value.children)) {
      // $scope.parent = value.name;
      // $scope.subcategory = value.children;
      $state.go('app.sport', {
        game: $stateParams.game,
        parentIndex: index
      })
    } else {
      console.log(value);
      $state.go('app.match-inner', {
        game: $stateParams.game,
        parentId: value._id
      })
    }
  };

});
