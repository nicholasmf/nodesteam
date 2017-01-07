app.controller('ProfileController', ['$scope', 'profile', function ($scope, profile) {
    $scope.profile = profile.profile;
    $scope.profile.personaname = profile.profile.personaname;

    //console.log($scope.profile.lastlogoff);

    $scope.saveProfile = function () {
        if (!$scope.profile || $scope.profile == {}) { return; }
        profile.create({
            steamid: $scope.profile.steamid,
            personaname: $scope.profile.personaname
        });
    }
}]);