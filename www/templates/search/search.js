myApp.controller("SearchCtrl", function (
  $scope,
  $ionicModal,
  $timeout,
  Service,
  jStorageService,
  ionicDatePicker,
  $filter
) {
  //   // var memberId = jStorageService.getUserId();
  //   var memberId = "5bac6e0afe33926b6c239d7d";
  $scope.form = {};
  $scope.searchEvent = function () {
    if (_.isEmpty($scope.form.searchText)) {
      $scope.searchEventdata = [];
    } else {
      if ($scope.form.searchText.length >= 3) {
        Service.searchEvent($scope.form, function (data) {
          console.log('Search Data', data);
          if (data.value) {
            $scope.searchEventdata = data.data;
          } else {
            $scope.searchEventdata = [];
          }
        });
      } else {
        $scope.searchEventdata = [];
      }
    }
  }
});
