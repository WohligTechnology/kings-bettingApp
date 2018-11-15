myApp.controller("ProfitLossCtrl", function (
  $scope,
  $ionicModal,
  $timeout,
  Service,
  jStorageService,
  ionicDatePicker,
  $filter
) {
  // var memberId = jStorageService.getUserId();
  var memberId = "5bac6e0afe33926b6c239d7d";
  $scope.formData = {};
  $scope.eventTypeData = [];
  $scope.isDetailedView = false;
  $scope.formData.fromDateold = new Date(moment().format());
  $scope.formData.fromDate = $filter("date")(
    $scope.formData.fromDateold,
    "MMM d, y"
  );
  $scope.formData.dateFormat = new Date(moment().format());
  $scope.formData.toDateold = new Date(moment().format());
  console.log($scope.formData.toDateold);
  $scope.formData.toDate = $filter("date")(
    $scope.formData.toDateold,
    "MMM d, y"
  );
  console.log($scope.formData.fromDate);

  // data selector for account statement
  var ipObj1 = {
    callback: function (val) {
      //Mandatory
      $scope.formData.fromDate = $filter("date")(
        new Date(val),
        "MMM d, y"
      );
      $scope.formData.dateFormat = $filter("date")(
        $scope.formData.date,
        "MMM d, y"
      );
      // $scope.accountStatement($scope.accountStatmentFilter, true)
      // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
    },
    dateFormat: $scope.fromDate,
    mondayFirst: true, //Optional
    closeOnSelect: false, //Optional
    templateType: "popup", //Optional
    to: new Date()
  };

  $scope.openDatePicker = function () {
    ionicDatePicker.openDatePicker(ipObj1);
  };
  // data selector for account statement
  var ipObj2 = {
    callback: function (val) {
      //Mandatory
      $scope.formData.toDate = $filter("date")(
        new Date(val),
        "MMM d, y"
      );
      $scope.formData.dateFormat = $filter("date")(
        $scope.formData.date,
        "MMM d, y"
      );
      //   $scope.accountStatement($scope.accountStatmentFilter, true)
      // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
    },

    dateFormat: $scope.toDate,
    mondayFirst: true, //Optional
    closeOnSelect: false, //Optional
    templateType: "popup", //Optional
    to: new Date()
  };

  $scope.openDatePicker2 = function () {
    ionicDatePicker.openDatePicker(ipObj2);
  };

  $scope.bettingPl = function (value) {
    console.log('Enter');
    $scope.formData.memberId = memberId;
    if (!_.isEmpty(value)) {
      $scope.formData.subGame = value;
    } else {
      delete $scope.formData.subGame;
    }
    //Raj
    $scope.formData.toDate = $filter("date")(
      new Date($scope.formData.toDate).setHours(0, 0, 0, 0),
      "MMM d, y"
    );
    $scope.formData.fromDate = $filter("date")(
      new Date($scope.formData.fromDate).setHours(0, 0, 0, 0),
      "MMM d, y"
    );
    //Previous
    // $scope.formData.fromDate = new Date(
    //   new Date($scope.formData.fromDate).setHours(0, 0, 0, 0)
    // );
    // $scope.formData.toDate = new Date(
    //   new Date($scope.formData.toDate).setHours(0, 0, 0, 0)
    // );
    Service.bettingPl($scope.formData, function (data) {
      $scope.isDetailedView = false;
      if (data.value) {
        $scope.bettingPldata = data.data.accounts;
        _.each(data.data.gameWiseNetProfit, function (n) {
          if (n._id == "Cricket") {
            $scope.eventTypeData[0] = n;
          }
          if (n._id == "Soccer") {
            $scope.eventTypeData[1] = n;
          }
          if (n._id == "Tennis") {
            $scope.eventTypeData[2] = n;
          }
          if (n._id == "Horse Racing") {
            $scope.eventTypeData[3] = n;
          }
          if (n._id == "Greyhound Racing") {
            $scope.eventTypeData[4] = n;
          }
        });
        $scope.totalPL = data.data.netProfit;
      } else {
        $scope.bettingPldata = [];
        $scope.eventTypeData = [];
        $scope.totalPL = "";
      }
    });
  };
  $scope.bettingPl({});
});
