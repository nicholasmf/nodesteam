app.factory('profile', ['$http', function ($http) {
    var ob = new Object();
    ob.test = { data: "null", _json: "" };
    ob.profile = {};

    ob.getData = function () {
        return $http.get('/dummy').then(function successCallback(response) {
            console.log(response.data);
            angular.copy(response.data, ob.test);
            //if (response._json) { angular.copy(response._json); }
        }, function failedCallback(response) {
            console.log("Failed on request profile");
        });
    };

    ob.getProfile = function () {
        return $http.get('/prof').then(function (response) {
            //console.log(response.data);
            angular.copy(response.data, ob.profile);
        }, function(response) {
            console.log("Failed to load profile");
        })
    }

    ob.saveProfile = function (prof) {
        return $http.post('/prof', prof).then(function (response) {
            console.log(response.data);
        }, function (response) {
            console.log("Error on adding new profile");
        });
    };

    return ob;
}])