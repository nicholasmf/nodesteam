app.factory('playedWith', ['$http', function ($http) {
    var ob = {};
        
        ob.searchUser = function (name, callback) {
            var arg = {name: name};
            console.log(arg.name);
            
            var callbackSuccess = function (response) {
                //console.log(response);
                callback(response);
                return;
            };
            
            var callbackFail = function (err) {
                console.log("Error: " + err);
                callback(err);
                return;
            };
            
            $http.post('/playedwith', arg).then(callbackSuccess, callbackFail);
            
        }
        return ob;
}]);