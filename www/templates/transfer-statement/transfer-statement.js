myApp.controller("transferStatementCtrl", function(
  $scope,
  $ionicModal,
  $timeout,
  Service
) {
  $scope.getPlayerTransaction = function(page) {
    $scope.userId = $.jStorage.get("userId");
    $scope.balancePlayerRate = $.jStorage.get("balancePlayerRate");
    Service.searchPlayerTransactionData(
      {
        _id: $scope.userId,
        page: page
      },
      function(data) {
        if (data.value) {
          console.log(data.data);
          $scope.items = data.data.results;
          $scope.totalItems = data.data.total;
          $scope.maxRow = data.data.options.count;
        } else {
          $scope.playerTransaction = [];
        }
      }
    );
  };
  $scope.getPlayerTransaction(1);
});
