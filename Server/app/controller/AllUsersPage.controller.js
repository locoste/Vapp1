app.controller('AllUsers', function($scope, $http, config) {
  const url = config.api_url;
  const port = config.api_port;

  $http.get('http://'+url+':'+port+'/getUserCompany').then(function(response){
    $scope.User = response.data.companies[0].company;
  });

  $http.get('http://'+url+':'+port+'/getUserDetails').then(function(response){
    $scope.Users = response.data;
  });
 });