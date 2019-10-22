app.controller('UserPage', function($scope, $http, config) {
  const url = config.api_url;
  const port = config.api_port;

  var project = getProject();

  $http.get('http://'+url+':'+port+'/getUserCompany').then(function(response){
    $scope.User = response.data.companies[0].company;
    $scope.company = response.data.companies[0].company;
    $scope.login = response.data.companies[0].login;
    $http.get('http://'+url+':'+port+'/getCompanyInformation/'+response.data.companies[0].company).then(function(responseCompany){
      $scope.email= responseCompany.data.customer.email;
      $scope.contact = responseCompany.data.customer.contact;
      $scope.phone_number = responseCompany.data.customer.phone_number;
    })
  })

  $scope.ChangeUser = function()
  {
    if($scope.password==$scope.repassword){
      var body = '{"login":"'+$scope.login+'", "company":"'+$scope.company+'", "password":"'+$scope.password+'","contact":"'+$scope.contact+'","email":"'+$scope.email+'","phone_number":"'+$scope.phone_number+'"}'
      $http.post('http://'+url+':'+port+'/updateUser', body).then(alert('User updated with success'))
    }
    else
    {
      alert('password have to be the same');
    }
  }

  function getProject()
  {
    var str = window.location.search;
    str = str.substr(1);
    return str;
  }
});