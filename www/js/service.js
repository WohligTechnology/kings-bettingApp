var myApp = angular.module("starter.services", []);
var imgurl = adminurl + "upload/";

var imgpath = imgurl + "readFile";
var uploadurl = imgurl;
myApp.factory("Service", function($http, $q, $log, $timeout) {
  var obj = {
    userLogin: function(url, formData, callback) {
      $http.post(adminurl + url, formData).then(function(data) {
        data = data.data;
        callback(data);
      });
    },
    apiCallWithData: function(url, formData, callback) {
      $http.post(adminurl + url, formData).then(function(data) {
        // console.log('data', data);
        data = data.data;
        callback(data);
      });
    },
    apiCallWithUrl: function(url, formData, callback) {
      $http.post(url, formData).then(function(data) {
        // console.log('data', data);
        data = data.data;
        callback(data);
      });
    },
    getMatchOddsData: function(url, formData, callback) {
      $http.post(adminurl + url, formData).then(function(data) {
        // console.log('data', data);
        data = data.data;
        callback(data);
      });
    },
    calculateBet: function(formData, callback) {
      $http
        .post(mainServer + "api/SportsBook/loseMoney", formData)
        .then(function(data) {
          data = data.data;
          callback(data);
        });
    },
    getAccountStatement: function(data, callback) {
      $http
        .post(mainServer + "api/SportsBook/getAccountStatement", data)
        .then(function(data) {
          callback(data);
        });
    },
    searchPlayerTransactionData: function(data, callback) {
      $http
        .post(mainServer + "api/transaction/searchPlayerTransactionData", data)
        .then(function(data) {
          // console.log(data);
          callback(data.data);
        });
    },
    changePassword: function(data, callback) {
      $http
        .post(mainServer + "api/member/changePassword", data)
        .then(function(data) {
          // console.log(data);
          data = data.data;
          callback(data);
        });
    },
    userGetOne: function(data, callback) {
      $http.post(mainServer + "api/member/getOne", data).then(function(data) {
        // console.log(data);
        data = data.data;
        callback(data);
      });
    },
    getUserBook: function(data1, callback) {
      $http
        .post(sportsSocket + "api/Book/getUserBook", {
          user: data1.user,
          marketId: data1.marketId
        })
        .then(function(data) {
          // console.log(data);
          callback(data);
        });
    },
    getPlayerExecutedBets: function(data1, callback) {
      $http
        .post(sportsSocket + "api/BetsExecuted/getPlayerExecutedBets", {
          player: data1.player,
          marketId: data1.marketId
          // page: data1.page
        })
        .then(function(data) {
          // console.log(data);
          callback(data);
        });
    },
    bettingPl: function(data, callback) {
      console.log("data log", data);
      $http
        .post(mainServer + "api/sportsbook/bettingPL", data)
        .then(function(data) {
          data = data.data;
          console.log("data return", data);
          callback(data);
        });
    },
    success: function() {
      var defer = $q.defer();
      $timeout(function() {
        $log.info("resolve");
        defer.resolve({
          msg: "SUCCESS"
        });
      }, 1000);
      return defer.promise;
    }
  };
  return obj;
});
