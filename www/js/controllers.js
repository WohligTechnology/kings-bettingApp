angular
  .module("starter.controllers", [])

  .controller("AppCtrl", function(
    $scope,
    $ionicModal,
    $timeout,
    $ionicSideMenuDelegate,
    $interval,
    $state,
    Service,
    $stateParams,
    jStorageService,
    TemplateService,
    ionicToast
  ) {
    // Form data for the login modal

    $scope.loginData = {};
    TemplateService.connectSocket();
    $scope.$on("$ionicView.enter", function() {
      $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.$on("$ionicView.leave", function() {
      $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.game = $state.params.game;
    $scope.parentId = $stateParams.parentId;

    $scope.oneClickBetting = "templates/directive/one-click-betting.html";

    var user = jStorageService.getUserId();
    var tick = function() {
      $scope.clock = Date.now();
    };
    tick();
    $interval(tick, 1000);
    if (!$.jStorage.get("accessToken")) {
      $state.go("login");
    }
    if ($.jStorage.get("userId")) {
      Service.userGetOne(
        {
          _id: $.jStorage.get("userId")
        },
        function(userData) {
          $scope.userInfo = userData.data;
        }
      );
    }

    $scope.getGames = function() {
      Service.apiCallWithData(
        "Category/getCategoriesForNavigation",
        {},
        function(data) {
          if (data.value) {
            if (!_.isEmpty(data.data)) {
              $scope.gameData = data.data;
              _.each($scope.gameData, function(game) {
                if (_.isEmpty(game.children)) {
                  game.hide = true;
                } else {
                  _.each(game.children, function(child) {
                    if (_.isEmpty(child.children)) {
                      child.hide = true;
                    }
                  });
                }
              });
              $scope.home = true;
            } else {
              $scope.gameData = [];
            }
          } else {
            alert("Unable get games");
          }
        }
      );
    };
    $scope.getGames();
    $scope.searchEvent = function(value) {
      Service.apiCallWithData(
        "category/searchEvent",
        {
          searchText: value
        },
        function(data) {
          $scope.searchData = data.data;
        }
      );
    };
    $scope.logout = function() {
      $.jStorage.flush();
      $state.go("login");
    };
    $scope.getAvailableCredit = function() {
      Service.apiCallWithUrl(
        mainServer + "api/sportsbook/getCurrentBalance",
        {
          _id: user
        },
        function(balanceData) {
          if (balanceData.value) {
            $scope.balanceData = balanceData.data;
          }
        }
      );
      Service.apiCallWithUrl(
        mainServer + "api/netExposure/getMemberNetExposure",
        {
          _id: user
        },
        function(netExposureData) {
          if (netExposureData.value) {
            console.log(
              "netExposureData!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
              netExposureData
            );
            $scope.netExposureData = netExposureData.data.netExposure
              ? netExposureData.data.netExposure * -1
              : 0;
            console.log(
              "$scope.netExposureData##########################",
              $scope.netExposureData
            );
          }
        }
      );
      $scope.mySocket1 = io.sails.connect(mainServer);
      $scope.mySocket1.on("Balance_" + user, function onConnect(balanceData) {
        $scope.balanceData = balanceData;
        $scope.$apply();
      });
      $scope.mySocket1.on("NetExposure_" + user, function onConnect(
        netExposureData
      ) {
        $scope.netExposureData = netExposureData.netExposure
          ? netExposureData.netExposure * -1
          : 0;
        $scope.$apply();
      });
    };
    $scope.getAvailableCredit();

    var user = $.jStorage.get("userId");

    $scope.editOneClickValue = function() {
      $scope.onclickEdit = !$scope.onclickEdit;
    };
    $scope.editStake = function() {
      $scope.stakeEdit = !$scope.stakeEdit;
    };
    $scope.setUserConfig = function(operation) {
      console.log(operation);
      var getIndex = _.findIndex($scope.userConfigData.oneClickStake, function(
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
        function(data) {
          $scope.getUserConfig();
          operation == "stake" ? $scope.editStake() : "";
          operation == "oneClickSave" ? $scope.editOneClickValue() : "";
          if (data.value) {
            //   toastr.success("user config changed successfully");
            ionicToast.show("user config changed successfully");
          } else {
            //   toastr.error("Unable to change user config");
            ionicToast.show("Unable to change user config");

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
    $scope.getUserConfig = function() {
      Service.apiCallWithData(
        "UserConfig/getUserConfig",
        {
          user: user
        },
        function(data) {
          if (data.value) {
            if (!_.isEmpty(data.data)) {
              $scope.userConfigData = data.data;
              if (
                !$scope.userConfigData.mobileStake ||
                $scope.userConfigData.mobileStake.length == 0
              ) {
                $scope.userConfigData.mobileStake = [25, 50, 100];
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
                mobileStake: [25, 50, 100],
                oneClickStake: [40, 50, 100],
                oneClickStatus: false,
                oneClickActiveStake: 40
              };
            }
          } else {
            $scope.userConfigData = {
              user: user,
              confirmStatus: true,
              mobileStake: [25, 50, 100],
              oneClickStake: [40, 50, 100],
              oneClickStatus: false,
              oneClickActiveStake: 40
            };
          }
          $scope.mobileStakes = _.cloneDeep($scope.userConfigData.mobileStake);
          $scope.oneClickStakes = _.cloneDeep(
            $scope.userConfigData.oneClickStake
          );
          $scope.activeStakeIndex = _.findIndex(
            $scope.userConfigData.oneClickStake,
            function(stake) {
              return $scope.userConfigData.oneClickActiveStake == stake;
            }
          );
        }
      );
    };
    $scope.getUserConfig();

    $scope.getTimeZone = function() {
      Service.apiCallWithUrl(
        mainServer + "api/member/getTimeZone",
        {
          memberId: user
        },
        function(data) {
          if (data.value) {
            if (data.data.timezone) {
              $.jStorage.set("timezone", data.data.timezone);
            } else {
              $.jStorage.set("timezone", "computer");
            }
          }
        }
      );
    };
    $scope.getTimeZone();
    $scope.setTimeZone = function(value) {
      Service.apiCallWithUrl(
        mainServer + "api/member/setTimeZone",
        {
          memberId: user,
          timezone: value
        },
        function(data) {
          if (data.value) {
            $state.reload();
            toastr.success("timezone updated");
          } else {
            toastr.error("error while saving timezone");
          }
        }
      );
    };
  });
