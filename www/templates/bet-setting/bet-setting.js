myApp.controller('BetsettingCtrl', function ($scope, $ionicModal, $timeout, Service) {
  var user = $.jStorage.get("userId");
  $scope.confirmOneClick = function () {
    // if ($scope.backArray.length > 0 || $scope.layArray.length > 0) {
    //   $scope.betRemove = $uibModal.open({
    //     animation: true,
    //     templateUrl: "views/modal/bet-remove.html",
    //     scope: $scope,
    //     stake: "md",
    //     backdrop: false
    //   });
    // } else {
    $scope.setUserConfig("oneClickToggle");
    // }
  };
  $scope.editOneClickValue = function () {
    $scope.onclickEdit = !$scope.onclickEdit;
  };
  $scope.setUserConfig = function (operation) {
    var getIndex = _.findIndex($scope.userConfigData.oneClickStake, function (
      stake
    ) {
      return $scope.userConfigData.oneClickActiveStake == stake;
    });
    if (getIndex == -1) {
      $scope.userConfigData.oneClickActiveStake =
        $scope.userConfigData.oneClickStake[$scope.activeStakeIndex];
    }
    Service.apiCallWithData(
      "UserConfig/setUserConfig",
      $scope.userConfigData,
      function (data) {
        $scope.getUserConfig();
        operation == "stake" ? $scope.editStakeModal.close() : "";
        operation == "oneClickSave" ? $scope.editOneClickValue() : "";
        if (data.value) {
          //   toastr.success("user config changed successfully");
        } else {
          //   toastr.error("Unable to change user config");
          if (operation == "oneClickToggle") {
            $scope.userConfigData.oneClickStatus = !$scope.userConfigData
              .oneClickStatus;
          }
          if (operation == "confirmBet") {
            $scope.userConfigData.confirmStatus = !$scope.userConfigData
              .confirmStatus;
          }
        }
      }
    );
  };
  $scope.getUserConfig = function () {
    Service.apiCallWithData(
      "UserConfig/getUserConfig", {
        user: user
      },
      function (data) {
        if (data.value) {
          if (!_.isEmpty(data.data)) {
            $scope.userConfigData = data.data;
            if (
              !$scope.userConfigData.stake ||
              $scope.userConfigData.stake.length == 0
            ) {
              $scope.userConfigData.stake = [25, 50, 100, 150, 200, 250];
            }
            if (
              !$scope.userConfigData.oneClickStake ||
              $scope.userConfigData.oneClickStake.length == 0
            ) {
              $scope.userConfigData.oneClickStake = [40, 50, 100];
              $scope.userConfigData.oneClickActiveStake = 40;
            }
          } else {
            $scope.userConfigData = {
              user: user,
              confirmStatus: true,
              stake: [25, 50, 100, 150, 200, 250],
              oneClickStake: [40, 50, 100],
              oneClickStatus: false,
              oneClickActiveStake: 40
            };
          }
        } else {
          $scope.userConfigData = {
            user: user,
            confirmStatus: true,
            stake: [25, 50, 100, 150, 200, 250],
            oneClickStake: [40, 50, 100],
            oneClickStatus: false,
            oneClickActiveStake: 40
          };
        }
        $scope.stakes = _.cloneDeep($scope.userConfigData.stake);
        $scope.oneClickStakes = _.cloneDeep(
          $scope.userConfigData.oneClickStake
        );
        $scope.activeStakeIndex = _.findIndex(
          $scope.userConfigData.oneClickStake,
          function (stake) {
            return $scope.userConfigData.oneClickActiveStake == stake;
          }
        );
      }
    );
  };
  $scope.getUserConfig();

})
