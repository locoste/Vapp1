app.controller('NewUser', function($scope, $http, config) {
  const url = config.api_url;
  const port = config.api_port;

  $scope.createUser = function(){
    console.log('in')
    var ticket;
    if($scope.password==$scope.repeatpassword){
      body = '{"company":"' + $scope.company + '", "contact":"' + $scope.contact + '", "email":"' + $scope.email + '", "phone_number":"' + $scope.phone_number + '", "login":"' + $scope.login + '", "password":"' + $scope.password + '"}'
      $http.post('http://'+url+':'+port+'/createUser', body).then(function(response){
        console.log(response.data)
        alert('Account successfully created')
        window.location.assign('login.html');
        })
    }
    else {
      alert('both password should be the same');
      $scope.password = "";
      $scope.repeatpassword = "";
    }
  }


  function getProject()
  {
    var str = window.location.search;
    str = str.substr(1);
    return str;
  }
});