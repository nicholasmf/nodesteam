app.factory('match', ['$http', function ($http) {
    var ob = { data: {} };

    ob.getMatchDetail = function (id) {
        //console.log(id);
        return $http.get('/getmatch/' + id).then(function (response) {
            console.log(response.data);
            angular.copy((response.data), ob.data);
            //console.log(ob.data);
        }, function (response) {
            console.log("error on requesting match detail");
        });
    };

    return ob;
}])