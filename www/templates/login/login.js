myApp.controller('LoginCtrl', function ($scope, $ionicModal, $timeout, toastr, Service, $state, ionicToast) {
  $scope.userLogin = function (value) {
    console.log(value);
    Service.userLogin("BetFair/userLogin", value, function (data) {
      console.log("data", (data.data));
      if (data.value && !_.isEmpty(data.data)) {
        $.jStorage.set("accessToken", data.data.accessToken);

        console.log($.jStorage.get("accessToken"));
        $.jStorage.set("userId", data.data.userId);
        // toastr.success("Logged in successfully!");
        ionicToast.show("Logged in successfully!");

        console.log("Logged in successfully!");
        $state.go('app.home');
      } else {
        console.log("Logged in Unsuccessfully!");
        // toastr.error("Unable to login");
        ionicToast.show("Unable to login");

      }
    });
  };

})
