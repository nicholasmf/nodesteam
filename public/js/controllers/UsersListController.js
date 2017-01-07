app.controller('UsersListController', ['$scope', '$http', 'usersList', 'profile', function ($scope, $http, usersList, profile) {
    $scope.usersList = usersList.list;
    $scope.matchesList = [];
    $scope.args = { usersList: [], excludeOthers: false };
    //console.log($scope.usersList[0]);
    //console.log(profile.test._json);

    if (profile.test._json) {
        console.log(usersList.list);
        for (var i = 0; i < usersList.list.length; i++) {
            if (usersList.list[i].personaname == profile.test._json.personaname) {
                $scope.args.usersList.push(usersList.list[i]);
            }
        }
    }
    else { console.log("not logged"); }

    $scope.add = function (user) {
        $scope.args.usersList.push(user);
    }

    $scope.remove = function (user) {
        var index = $scope.args.usersList.indexOf(user);
        $scope.args.usersList.splice(index, 1);
    }

    $scope.getMatches = function () {
        //args = [];
        //args.push(49767678);
            
        if ($scope.args.usersList.length <= 1) { return; }        

        var args = { list: [], excludeOthers: $scope.args.excludeOthers };
        for (var i = 0; i < $scope.args.usersList.length; i++) {
            args.list[i] = $scope.args.usersList[i].steamid32;
            console.log(args.list[i]);
        };

        return $http.post('/getmatches', args).then(function (response) {
            console.log(response);
            angular.copy(response.data, $scope.matchesList);
        }, function (err) {
            console.log("Error: " + err);
        });
    }
}]);