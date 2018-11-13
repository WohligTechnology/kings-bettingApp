myApp.service('jStorageService', function ($http) {
    var userInfo = {};
    this.getuserInfo = function () {
        $http.post(mainServer + 'api/member/getOne', {
            _id: $.jStorage.get("userId")
        }).then(function (data) {
            if (data.data.value) {
                userInfo = data.data.data;
            }
        });
    }

    this.getUserData = function () {
        return userInfo;
    }

    this.getAccessToken = function () {
        var data = $.jStorage.get("accessToken");
        console.log("data", data);
        return data;
        // return "abc1";
    };

    this.getUserId = function () {
        var data = $.jStorage.get("userId");
        console.log("data", data);
        return data;
    };

});