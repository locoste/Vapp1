app.controller('DisplayProjectUser', function($scope, $http, config) {
  const url = config.api_url;
  const port = config.api_port;
  const alf_url = config.alf_url;
  const alf_port = config.alf_port;
  const scan_url = config.scan_url;
  const scan_port = config.scan_port;
  var project = getProject();

  $http.get('http://'+url+':'+port+'/getProject/' + project, 
  {
    headers : 
    {'Content-Type' : 'application/json'}

  }).then(function(response) {
    $scope.project_reference = response.data.project.project_name;
    $scope.description = response.data.project.project_description;
    $scope.company = response.data.project.customer.company;
    $scope.contact = response.data.project.customer.contact;
    $scope.email = response.data.project.customer.email;
    $scope.phone_number = response.data.project.customer.phone_number;
    $scope.status = response.data.project.status;
    $scope.internal_reference = response.data.project.internal_reference;
    $scope.delivery = response.data.project.expected_delivery;

    $http.get('http://'+url+':'+port+'/getProjectFiles/'+project).then(function(response){
      var files = new Array;
      //var scan = new Array;
      for (i=0; i<response.data.length; i++){
        var str = response.data[i].document_name;
        var n = str.indexOf(".");
          files.push({name: response.data[i].document_name, type: str.substr(n+1).toUpperCase()})
      }
      //$scope.scans = scan;
      console.log(files)
      $scope.files = files;
    })

  });

  $http.get('http://'+url+':'+port+'/getQuantities/'+project).then(function(response){
        $scope.displayQuantity = response.data;
        $scope.quantity = 0;
        $scope.lot_size = "";
        $scope.nbr_of_lot = 0;
        $scope.default_label = "";
      })

  $http.get('http://'+url+':'+port+'/getUserCompany').then(function(response){
    $scope.User = response.data.companies[0].company;
  })

  $scope.deleteFile = function(fileName){

      $http.delete('http://'+url+':'+port+'/deleteFile/'+fileName+'/'+project).then(function(reponse){
        refreshDocuments();
      })
  }

  $scope.lotSize = function()
  {
    if($scope.quantity != undefined && $scope.nbr_of_lot != undefined) {
      $scope.lot_size = $scope.quantity / ($scope.nbr_of_lot);
    }
  }

  $scope.AddQuantity = function(){
    var body = '{"quantity": { "quantity":' + $scope.quantity + ', "lot_size": '+ $scope.lot_size + ', "number_of_lot": '+ $scope.nbr_of_lot +', "default_label": "'+ $scope.default_label +'"}}'
    $http.post('http://'+url+':'+port+'/newQuantity/'+project, body).then(function(response){
      $http.get('http://'+url+':'+port+'/getQuantities/'+project).then(function(response){
        $scope.displayQuantity = response.data;
        $scope.quantity = 0;
        $scope.lot_size = "";
        $scope.nbr_of_lot = 0;
        $scope.default_label = "";
      })
    })
  }

  $scope.deleteQuantity = function(id){
    $http.delete('http://'+url+':'+port+'/deleteQuantity/'+id).then(function(response){
       $http.get('http://'+url+':'+port+'/getQuantities/'+project).then(function(response){
        $scope.displayQuantity = response.data;
        $scope.quantity = 0;
        $scope.lot_size = "";
        $scope.nbr_of_lot = 0;
        $scope.default_label = "";
        alert('row deleted');
      })
    })
  }

  $scope.displayFileName = function(){
    var files = $scope.files;
    var scan = $scope.scans;
    console.log('name: '+document.getElementById('files').files[0].name)
    for (i=0; i<document.getElementById('files').files.length; i++){
      var str = document.getElementById('files').files[i].name
      var n = str.indexOf(".");
      if (str.substr(n+1) == "stp" || str.substr(n+1)=="step" || str.substr(n+1)=="stl"){
        files.push({name: document.getElementById('files').files[i].name, type: str.substr(n+1).toUpperCase()})
        upload3DScan(document.getElementById('files').files[i], project);
      } else {
        files.push({name: document.getElementById('files').files[i].name, type: str.substr(n+1).toUpperCase()})
        uploadDCME(document.getElementById('files').files[i]);
      }
    }
    $scope.scans = scan;
    $scope.files = files;
  }

  function upload3DScan(file, project){
    var fd = new FormData();
    fd.append('file', file);
    var uploadUrl = 'https://'+scan_url+':'+scan_port+'/3dscan/v1/FitmanGL/rest/post/upload';
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined, 'Accept':'application/xml'}
    }).then(function(){
      $http.get('http://'+url+':'+port+'/getProject/'+project).then(function(response){
        var body = '{"document_name":"'+file.name+'","type":"3DScan"}'
        $http.post('http://'+url+':'+port+'/newFile/'+response.data.project.project_id, body).then(function(response){
          console.log(file.document_name + ' is uploaded!!')
        })
      })
    });
  }

  function uploadDCME(file){
    $http.get('http://'+url+':'+port+'/getProjectDCMEId/'+project).then(function(responseID){
      var destination = responseID.data[0].dcme_folder
      $http.get('http://'+url+':'+port+'/getTicket').then(function(response){
        var ticket = response.data

        // uploading file
        var form = new FormData();
        form.append('filedata', file);
        form.append('destination','workspace://SpacesStore/'+destination)
        var uploadDCMEUrl = 'http://'+alf_url+':'+alf_port+'/alfresco/service/api/upload?alf_ticket='+ticket;

        $http.post(uploadDCMEUrl, form, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        }).then(function(responseNode){
          console.log('nodeRef: '+responseNode.data.nodeRef);
          body='{"document_name": "'+ file.name +'", "type":"DCME", "nodeRef":"'+responseNode.data.nodeRef+'"}'
          $http.get('http://'+url+':'+port+'/getProject/'+project).then(function(responsePro){
            $http.post('http://'+url+':'+port+'/newFile/' + responsePro.data.project.project_id, body).then(function(response){
              console.log(file.name + " documents saved!!!");
            })
          })
        })
      })
    })
  }

  function refreshDocuments(){
    $http.get('http://'+url+':'+port+'/getProjectFiles/'+project).then(function(response){
      console.log(response.data);
      var files = new Array;
     for (i=0; i<response.data.length; i++){
        var str = response.data[i].document_name;
        var n = str.indexOf(".");
          files.push({name: response.data[i].document_name, type: str.substr(n+1).toUpperCase()})
      }
      console.log(files)
      $scope.files = files;
    })
  }

  $scope.showQuantity = function(){
    window.open('http://'+url+':'+port+'/Vapp1/Quantity.html?'+$scope.project_reference);
  }

  $scope.logout = function(){
    $http.post('http://'+url+':'+port+'/logout').then(function(response){console.log(response)})
  }

  $scope.saveChangement = function()
  {
    data = '{"project": {    "project_name": "' + $scope.project_reference + '","internal_reference": "' + $scope.internal_reference + '",    "project_description": "'+ $scope.description +'",    "customer": "'+ $scope.company +'"  }}';
    $http.put('http://'+url+':'+port+'/updateProject/' + project, data, {
      headers : 
      {'Content-Type' : 'application/json'}
    }).then(function(response){
      console.log("project Saved!!!!")
    })
  }

  function getProject()
  {
    var str = window.location.search;
    str = str.substr(1);
    return str;
  }
});