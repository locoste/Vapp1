app.controller('UserPage', function($scope, $http, config) {
  const url = config.api_url;
  const port = config.api_port;

  var project = getProject();

  $http.get('http://'+url+':'+port+'/getUserCompany').then(function(response){
    $scope.User = response.data.companies[0].company;
  });

  $http.get('http://'+url+':'+port+'/getUserCompany/'+project).then(function(response){
    $scope.company = response.data[0].company;
    $scope.login = response.data[0].login;
    $scope.email= response.data[0].email;
    $scope.contact = response.data[0].contact;
    $scope.phone_number = response.data[0].phone_number;
    $scope.password = response.data[0].password;
  })

  $scope.updateRole = function(){
    var body = '{"customer_id":'+project+', "role":"'+$scope.role+'"}'
    $http.put('http://'+url+':'+port+'/updateCustomerRole', body).then(function(response){
      if(response.data != "You're not allow to do that"){
        alert('role updated to '+$scope.role);
      } else {
        alert(response.data)
      }
      
    })
  }

  function getProject()
  {
    var str = window.location.search;
    str = str.substr(1);
    return str;
  }
});