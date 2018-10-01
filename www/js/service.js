var myApp = angular.module('starter.services', []);
// var adminurl = adminUUU;
// adminurl = adminurl + "/api/";
adminUUU = "https://rates.kingsplay.co/"; //socket betfair
sportsSocket = "https://sportsbooktest.kingsplay.co/";
// adminUUU = "http://localhost:1338/"; //socket betfair
// sportsSocket = "http://localhost:1337/";
// sportsSocket = "http://192.168.1.121:1337/";
// sportsSocket = "http://192.168.43.8:1337/";
adminurl = sportsSocket + "api/"; //sports book
// mainServer = "http://192.168.1.105:1337/"; //main server
mainServer = "https://kingplay.online/"; //main server
// mainServer = "http://192.168.2.31:1337/"; //main server
// adminurl = "http://192.168.1.107:1337/api/"
// io.sails.url = adminUUU;
// io.sails.autoConnect = false;

myApp.factory('Service', function ($http, $q, $log, $timeout) {
    var obj = {
        userLogin: function (url, formData, callback) {
            $http.post(adminurl + url, formData).then(function (data) {
                data = data.data;
                callback(data);
            });
        },
        apiCallWithData: function (url, formData, callback) {
            $http.post(adminurl + url, formData).then(function (data) {
                // console.log('data', data);
                data = data.data;
                callback(data);
            });
        },
        apiCallWithUrl: function (url, formData, callback) {
            $http.post(url, formData).then(function (data) {
                // console.log('data', data);
                data = data.data;
                callback(data);
            });
        },
        getMatchOddsData: function (url, formData, callback) {
            $http.post(adminurl + url, formData).then(function (data) {
                console.log('data', data);
                data = data.data;
                callback(data);
            });
        },

        calculateBet: function (formData, callback) {
            $http.post("http://192.168.1.107:1337/api/SportsBook/loseMoney", formData).then(function (data) {
                data = data.data;
                callback(data);
            });
        },

        getAccountStatement: function (data, callback) {
            $http.post(mainServer + 'api/SportsBook/getAccountStatement', data).then(function (data) {
                console.log(data);
                callback(data);
            });
        },
        searchPlayerTransactionData: function (data, callback) {
            $http.post(mainServer + 'api/transaction/searchPlayerTransactionData', data).then(function (data) {
                console.log(data);
                callback(data.data);
            });
        },
        changePassword: function (data, callback) {
            $http.post(mainServer + 'api/member/changePassword', data).then(function (data) {
                console.log(data);
                data = data.data;
                callback(data);
            });
        },
        userGetOne: function (data, callback) {
            $http.post(mainServer + 'api/member/getOne', data).then(function (data) {
                console.log(data);
                data = data.data;
                callback(data);
            });
        },
        getUserBook: function (data1, callback) {
            $http.post(sportsSocket + 'api/Book/getUserBook', {
                user: data1.user,
                marketId: data1.marketId
            }).then(function (data) {
                console.log(data);
                callback(data);
            });
        },
        getPlayerExecutedBets: function (data1, callback) {
            $http.post(sportsSocket + 'api/BetsExecuted/getPlayerExecutedBets', {
                player: data1.player,
                marketId: data1.marketId,
                // page: data1.page
            }).then(function (data) {
                console.log(data);
                callback(data);
            });
        },
        success: function () {
            var defer = $q.defer();
            $timeout(function () {
                $log.info('resolve');
                defer.resolve({
                    msg: 'SUCCESS'
                });
            }, 1000);
            return defer.promise;
        },
    };
    return obj;
});