app.controller('MainController', ['$scope', '$http', 'profile', function ($scope, $http, profile) {
    //console.log(profile.success);
    //profile.getData();
    //console.log(profile.test);
    //$scope.test = profile.success().data;
    //$scope.test = profile.getData();
    $scope.test = profile.test.data;
    //console.log("hey");
    $scope.getMatches = function () {
        $http.get('/lastgames').then(function(response) {
            var resobj = JSON.parse(response.data);
            //console.log(response.data);
            $scope.matches = resobj.result.matches;
        }, function(response) {
            console.log("error on loading matches");
        });
    }
}]);