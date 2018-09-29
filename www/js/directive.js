myApp.directive('balance', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        balanceData: "=ngBalance",
      },
      templateUrl: 'templates/directive/balance.html',
      link: function ($scope, element, attr) {

      }
    };
  })
  ;