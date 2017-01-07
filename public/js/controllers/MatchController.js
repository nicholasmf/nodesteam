app.controller('MatchController', ['$scope', 'match', function ($scope, match) {
    $scope.match = match.data;
    //$scope.match = JSON.parse(match.data);
    $scope.match = $scope.match.result;
    $scope.match.radiant_win = $scope.match.radiant_win ? 'Radiant' : 'Dire';
}]);