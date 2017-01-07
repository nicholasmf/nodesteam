app.factory('usersList', ['$http', function ($http) {
    var ob = { list: []};

    ob.getList = function () {
        return $http.get('/getUsersList').then(function (response) {
            console.log(response.data.list);
            angular.copy(response.data.list, ob.list);
        }, function () {
            console.log("Error on getting users list");
        });
    };

    return ob;
}]);