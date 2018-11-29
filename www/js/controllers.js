angular
  .module("starter.controllers", [])

  .controller("AppCtrl", function (
    $scope,
    $ionicModal,
    $timeout,
    $ionicSideMenuDelegate,
    $interval,
    $state,
    Service,
    $stateParams,
    jStorageService,
    TemplateService
  ) {
    // Form data for the login modal

    $scope.loginData = {};
    TemplateService.connectSocket();
    $scope.$on("$ionicView.enter", function () {
      $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.$on("$ionicView.leave", function () {
      $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.game = $state.params.game;
    $scope.parentId = $stateParams.parentId;

    var user = jStorageService.getUserId();
    var tick = function () {
      $scope.clock = Date.now();
    };
    tick();
    $interval(tick, 1000);
    if (!$.jStorage.get("accessToken")) {
      $state.go("login");
    }
    if ($.jStorage.get("userId")) {
      Service.userGetOne({
          _id: $.jStorage.get("userId")
        },
        function (userData) {
          $scope.userInfo = userData.data;
        }
      );
    }

    //logout
    $scope.logout = function () {
      $.jStorage.flush();
      $state.go("login");
    };
    $scope.home = true;
    // $scope.visitedCategories = [];
    $scope.getNavigationDetails = function () {
      var toState = $state.current;
      var toParams = $state.params;
      console.log("toState", toParams);
      console.log(toState, "toParams");

      if (toState.name == "app.home" && _.isEmpty(toParams.game)) {
        console.log("toParams.game", toParams.game);
        $scope.game = toParams.game;
        $scope.navigationLevel = 0;
      } else if (
        toState.name == "app.sport" &&
        !_.isEmpty(toParams.game) &&
        _.isEmpty(toParams.parentId)
      ) {
        console.log("toParams.game", toParams.game);
        $scope.game = toParams.game;
        $scope.navigationLevel = 1;
        $scope.sideDirect = "sidenav2";
      } else if (
        toState.name == "app.sport" &&
        !_.isEmpty(toParams.game) &&
        !_.isEmpty(toParams.parentId)
      ) {
        $scope.game = toParams.game;
        $scope.navigationLevel = 2;
        $scope.sideDirect = "sidenav3";
      } else if (toState.name == "home.detailPage") {
        $scope.game = toParams.game;
        $scope.parentId = toParams.parentId;
        $scope.navigationLevel = 3;
        $scope.sideDirect = "sidenav4";
      } else {
        $scope.sideDirect = "sidenav1";
        $scope.navigationLevel = 0;
      }
      $scope.showCategoryAccordingly();
    };
    $scope.showCategoryAccordingly = function () {
      if ($scope.navigationLevel == 1) {
        $scope.subcategory = _.find($scope.gameData, function (game) {
          return game.name == $scope.game;
        }).children;
      } else if ($scope.navigationLevel == 2) {
        var category = _.find($scope.gameData, function (game) {
          return game.name == $scope.game;
        }).children;
        $scope.subcategory = _.find(category, function (cate) {
          return cate._id == $scope.parentId;
        }).children;
      } else if ($scope.navigationLevel == 3) {
        var category = _.find($scope.gameData, function (game) {
          return game.name == $scope.game;
        }).children;
        $scope.categoryData = _.find(category, function (cate) {
          if (cate.children) {
            var child = _.find(cate.children, function (child) {
              return child._id == $scope.parentId;
            });
            // TemplateService.detailName = child.name;
            // console.log(child);
            return child;
          }
        });
        $scope.subcategory = $scope.categoryData.children;
      } else {
        $scope.subcategory = [];
      }
    };
    //To get games
    //To get games
    $scope.getGames = function () {
      Service.apiCallWithData(
        "Category/getCategoriesForNavigation", {},
        function (data) {
          if (data.value) {
            if (!_.isEmpty(data.data)) {
              $scope.gameData = data.data;
              $scope.getNavigationDetails();
              _.each($scope.gameData, function (game) {
                if (_.isEmpty(game.children)) {
                  game.hide = true;
                } else {
                  _.each(game.children, function (child) {
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

    // //To get sub Category
    $scope.getSubCategory = function (value) {
      if (!_.isEmpty(value)) {
        $state.go(
          "app.sport", {
            game: $scope.game,
            parentId: $scope.parentId
          }, {
            notify: false
          }
        );
        $scope.subcategory = value;
      }
    };

    $scope.getGameName = function (value) {
      $scope.game = value;
    };

    $scope.getParentId = function (value) {
      $scope.previousParentId = $scope.parentId;
      $scope.parentId = value;
    };

    $scope.getPreviousCategory = function () {
      if (!_.isEmpty($scope.previousState)) {
        if (!$scope.next) {
          $scope.next = true;
          $scope.previous = false;
        } else {
          $scope.next = false;
          $scope.previous = true;
        }
        $scope.subcategory =
          $scope.previousState[$scope.previousState.length - 1];
        $scope.parentId = $scope.previousParentId;
        $scope.previousState.pop();
        $state.go(
          "homeInside", {
            game: $scope.game,
            parentId: $scope.parentId
          }, {
            notify: false
          }
        );
      } else {
        $scope.subcategory = [];
        $scope.previousState = [];
        $scope.home = true;
        $scope.next = false;
        $scope.previous = false;
        $state.go("home", {
          notify: false
        });
      }
    };

    // //Go to home menu
    $scope.goTohome = function () {
      $scope.subcategory = [];
      $scope.previousState = [];
      $scope.home = true;
      $scope.next = false;
      $scope.previous = false;
      $state.go("home", {
        notify: false
      });
    };

    $scope.searchEvent = function (value) {
      Service.apiCallWithData(
        "category/searchEvent", {
          searchText: value
        },
        function (data) {
          $scope.searchData = data.data;
        }
      );
    };

    $scope.getAvailableCredit = function () {
      Service.apiCallWithUrl(
        mainServer + "api/sportsbook/getCurrentBalance", {
          _id: user
        },
        function (balanceData) {
          if (balanceData.value) {
            $scope.balanceData = balanceData.data;
          }
        }
      );
      Service.apiCallWithUrl(
        mainServer + "api/netExposure/getMemberNetExposure", {
          _id: user
        },
        function (netExposureData) {
          if (netExposureData.value) {
            console.log(
              "netExposureData!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
              netExposureData
            );
            $scope.netExposureData = netExposureData.data.netExposure ?
              netExposureData.data.netExposure * -1 :
              0;
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
        $scope.netExposureData = netExposureData.netExposure ?
          netExposureData.netExposure * -1 :
          0;
        $scope.$apply();
      });
    };
    $scope.getAvailableCredit();

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
    $scope.editStake = function () {
      $scope.stakeEdit = !$scope.stakeEdit;
    }
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
          operation == "stake" ? $scope.editStake() : "";
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
            function (stake) {
              return $scope.userConfigData.oneClickActiveStake == stake;
            }
          );
        }
      );
    };
    $scope.getUserConfig();
  });
