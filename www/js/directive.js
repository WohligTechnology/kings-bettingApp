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
  .directive('market', function () {
    return {
      restrict: 'E',
      replace: false,
      templateUrl: 'templates/directive/market.html',
      link: function ($scope, element, attr) {

      }
    };
  })
  .directive('betForm', function () {
    return {
      restrict: 'E',
      replace: false,
      templateUrl: 'templates/directive/bet-form.html',
      link: function ($scope, element, attr) {

      }
    };
  })
  .directive('marketVolume', function () {
    return {
      restrict: 'E',
      replace: false,
      templateUrl: 'templates/directive/market-volume.html',
      link: function ($scope, element, attr) {

      }
    };
  })
  .directive('betButton', function () {
    return {
      restrict: 'E',
      replace: false,
      templateUrl: 'templates/directive/bet-button.html',
      link: function ($scope, element, attr) {

      }
    };

  })
  .directive('myBets', function () {
    return {
      restrict: 'E',
      replace: false,
      templateUrl: 'templates/directive/my-bets.html',
      link: function ($scope, element, attr) {

      }
    };

  })
  .directive('displaynumber', function ($http, $filter) {
    return {
      templateUrl: 'templates/directive/display-number.html',
      scope: {
        model: '=ngModel',
        // decimal: '=decimal'
      },
      link: function ($scope, element, attrs) {
        // $scope.decimal = $scope.decimal ? $scope.decimal : 2;
      }
    };
  })
  .directive('searchEvent', function () {
    return {
      restrict: 'E',
      replace: false,
      templateUrl: 'templates/directive/search.html',
      link: function ($scope, element, attr) {

      }
    };

  });
