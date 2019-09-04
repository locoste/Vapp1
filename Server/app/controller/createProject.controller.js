app.controller('postNewProject', function($scope, $http, config) {
  const url = config.api_url;
  const port = config.api_port;
  const alf_url = config.alf_url;
  const alf_port = config.alf_port;
  const scan_url = config.scan_url;
  const scan_port = config.scan_port; 

  $http.get('http://'+url+':'+port+'/getCompanies').then(function(response) {
    $scope.customers = response.data.companies;
  })

  $http.get('http://'+url+':'+port+'/getUserCompany').then(function(response){
    $scope.User = response.data.companies[0].company;
  })

  $http.get('http://'+url+':'+port+'/getQuantities').then(function(response){
    $scope.displayQuantity = response.data;
    $scope.quantity = 0;
    $scope.lot_size = "";
    $scope.nbr_of_lot = 0;
    $scope.default_label = "";
  })

  $scope.deleteBackQuantity = function()
  {
    $http.delete('http://'+url+':'+port+'/deleteQuantityBackProject').then(function(response){})
  }

  $scope.submitProject = function() 
  {
    if($scope.projectName != undefined && $scope.description != undefined && $scope.delivery != undefined && $scope.company != undefined){
    data = '{"project": {"projectName": "' + $scope.projectName + '","projectDescription": "'+ $scope.description +'","expectedDelivery": "'+ $scope.delivery +'","status": "Submited","customer": "'+ $scope.company +'"  }}';
    $http.post('http://'+url+':'+port+'/newProject', data).then(function(response) {
      var result='one of your project already named: '+$scope.projectName
      if(response.data!=result){
        console.log(response.data);
        console.log($scope.scans)
        console.log($scope.file)
        if($scope.scans != undefined){
          for(i=0; i<$scope.scans.length; i++){ 
            upload3DScan($scope.scans[i], response.data.project);
          }
        }

        if($scope.files != undefined){
          for(j=0; j<$scope.files.length; j++){
            console.log($scope.files[j])
            uploadDCME($scope.files[j], response.data.project, response.data.dcme_folder);
          }
        }
        alert('project submitted!')
        window.location.assign('http://'+url+':'+port+'/Vapp1/Accueil.html')
        document.getElementById('refToHome').href="Accueil.html";
      } else {
        alert(result)
        window.location.assign('http://'+url+':'+port+'/Vapp1/Accueil.html')
      }
    });
  } else {
    alert("You have not fill all field");
  }
  }


  $scope.displayFileName = function(){
    var files = new Array;
    var scan = new Array;
    for (i=0; i<document.getElementById('files').files.length; i++){
      var str = document.getElementById('files').files[i].name
      var n = str.indexOf(".");
      if (str.substr(n+1) == "stp" || str.substr(n+1)=="step" || str.substr(n+1)=="stl"){
        scan.push(document.getElementById('files').files[i])
      } else {
        files.push(document.getElementById('files').files[i])
      }
    }
    $scope.scans = scan;
    $scope.files = files;
  }

  $scope.lotSize = function()
  {
    if($scope.quantity != undefined && $scope.nbr_of_lot != undefined) {
      $scope.lot_size = $scope.quantity / ($scope.nbr_of_lot);
    }
  }

  $scope.AddQuantity = function(){
    var body = '{"quantity": { "quantity":' + $scope.quantity + ', "lot_size": '+ $scope.lot_size + ', "number_of_lot": '+ $scope.nbr_of_lot +', "default_label": "'+ $scope.default_label +'"}}'
    $http.post('http://'+url+':'+port+'/newQuantity', body).then(function(response){
      $http.get('http://'+url+':'+port+'/getQuantities').then(function(response){
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
       $http.get('http://'+url+':'+port+'/getQuantities').then(function(response){
        $scope.displayQuantity = response.data;
        $scope.quantity = 0;
        $scope.lot_size = "";
        $scope.nbr_of_lot = 0;
        $scope.default_label = "";
        alert('row deleted');
      })
    })
  }

  $scope.customerInformation = function(company)
  {
    $http.get('http://'+url+':'+port+'/getCompanyInformation/' + company).then(function(response) {
      $scope.contact = response.data.customer.contact;
      $scope.email = response.data.customer.email;
      $scope.phone_number = response.data.customer.phone_number;
    })
  }
  
  function upload3DScan(file, project){
    var fd = new FormData();
    fd.append('file', file);
    var uploadUrl = 'https://'+scan_url+':'+scan_port+'/3dscan/v1/FitmanGL/rest/post/upload';
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined, 'Accept':'application/xml'}
    }).then(function(){
      var body = '{"document_name":"'+file.name+'","type":"3DScan"}'
      $http.post('http://'+url+':'+port+'/newFile/'+project, body).then(function(response){
        console.log(file.name + ' is uploaded!!')
      })
    });
  }

  function uploadDCME(file, project, destination){
    console.log(file)
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
        console.log(responseNode.data.nodeRef);
        body='{"document_name": "'+ file.name +'", "type":"DCME", "nodeRef":"'+responseNode.data.nodeRef+'"}'
        body='{"document_name": "'+ file.name +'", "type":"DCME", "nodeRef":"workspace://SpacesStore/ef77efc3-8484-40d3-ac4b-c7648f518264"}'
        $http.post('http://'+url+':'+port+'/newFile/' + project, body).then(function(response){
          console.log(file.name + " documents saved!!!");
        })
      })
      
    })
  }
});