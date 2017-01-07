app.controller('PlayedWithController', ['$scope', 'playedWith', function ($scope, playedWith) {

    $scope.searchUser = function () {
        playedWith.searchUser($scope.playerName, function (response) {
            //console.log(response.data);
            $scope.result = response.data;
        });
        $scope.playerName = '';
    }
}]);