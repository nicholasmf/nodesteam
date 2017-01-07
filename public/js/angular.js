var app = angular.module('steamApp', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainController',
        resolve: {
            postPromise: ['profile', function (profile) {
                return profile.getData();
            }]
        }
    })
    .state('profile', {
        url: '/profile',
        templateUrl: '/profile.html',
        controller: 'ProfileController',
        resolve: {
            postPromise: ['profile', function (profile) {
                return profile.getProfile();
            }]
        }
    })
    .state('matchDetail', {
        url: '/matchdetail/{id}',
        templateUrl: '/matchdetail.html',
        controller: 'MatchController',
        resolve: {
            postPromise: ['$stateParams', 'match', function ($stateParams, match) {
                return match.getMatchDetail($stateParams.id);
            }]
        }
    })
    .state('usersList', {
        url: '/userslist',
        templateUrl: '/userslist.html',
        controller: 'UsersListController',
        resolve: {
            postPromise: ['usersList', 'profile', function (usersList, profile) {
                profile.getData();
                return usersList.getList();
            }]
        }
        })
    .state('playedWith', {
        url: '/playedwith',
        templateUrl: '/playedwith.html',
        controller: 'PlayedWithController'        
    })
    .state('invalid', {
        url: '/invalid',
        templateUrl: '/invalid.html'
    });
    $urlRouterProvider.otherwise('invalid');
}]);
