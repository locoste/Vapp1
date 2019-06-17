app.controller('Quantity', function($scope, $http, config) {
  const url = config.api_url;
  const port = config.api_port;

  var project = getProject();

  if(project != ""){
    $http.get('http://'+url+':'+port+'/getQuantities/' + project, {
      headers : 
      {'Content-Type' : 'application/json'}
      
    }).then(function(response){
      $scope.displayQuantity = response.data.quantities;
    })
  } else {
    $http.get('http://'+url+':'+port+'/getQuantities', {
      headers : 
      {'Content-Type' : 'application/json'}
      
    }).then(function(response){
      $scope.displayQuantity = response.data.quantities;
    })
  }

  $http.get('http://'+url+':'+port+'/getUserCompany').then(function(response){
    $scope.User = response.data.companies[0].company;
  })

  $scope.logout = function(){
    $http.post('http://'+url+':'+port+'/logout').then(function(response){console.log(response)})
  }

  $scope.AddQuantity = function()
  {
    var body = '{"quantity": { "quantity":' + $scope.quantity + ', "lot_size": '+ $scope.lot_size + ', "number_of_lot": '+ $scope.nbr_of_lot +', "default_label": "'+ $scope.default_label +'"}}'
    if(project!=''){
      $http.post('http://'+url+':'+port+'/newQuantity/'+ project, body,{
        headers : 
        {'Content-Type' : 'application/json'}
        
      }).then(function(response){
        console.log("quantiy created!!");
        window.location.reload();
      })
    } else {
      $http.post('http://'+url+':'+port+'/newQuantity', body,{
        headers : 
        {'Content-Type' : 'application/json'}
        
      }).then(function(response){
        console.log("quantiy created!!");
        window.location.reload();
      })
    }
  }

  $scope.lotSize = function()
  {
    if($scope.quantity != undefined && $scope.nbr_of_lot != undefined) {
      $scope.lot_size = $scope.quantity / ($scope.nbr_of_lot);
    }
  }

  $scope.closeWindow = function(){
    window.close();
  }

  function getProject()
  {
    var str = window.location.search;
    str = str.substr(1);
    return str;
  }
})