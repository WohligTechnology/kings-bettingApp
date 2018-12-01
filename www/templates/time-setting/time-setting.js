myApp.controller("timeSettingCtrl", function(
  $scope,
  ionicToast,
  Service,
  $state
) {
  var user = $.jStorage.get("userId");
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
          $scope.getTimeZone();
          ionicToast.show("timezone updated");
        } else {
          ionicToast.show("error while saving timezone");
        }
      }
    );
  };
});
