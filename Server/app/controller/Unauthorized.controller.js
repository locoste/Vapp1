app.controller('unauthorized', function($scope, $http, config) {
	const url = config.api_url;
	const port = config.api_port;

	$http.get('http://'+url+':'+port+'/getUserCompany').then(function(response){
		$scope.User = response.data.companies[0].company;
	})

	$scope.logout = function(){
		$http.post('http://'+url+':'+port+'/logout').then(function(response){console.log(response)})
	}
});