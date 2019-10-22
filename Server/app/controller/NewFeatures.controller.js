app.controller('NewFeatures', function($scope, $http, config) {
  const url = config.api_url;
  const port = config.api_port;
  const alf_url = config.alf_url;
  const alf_port = config.alf_port;
  const scan_url = config.scan_url;
  const scan_port = config.scan_port;
  var project = getProject();
 
  $scope.file = [];
  $scope.selectedFile = [];
  var iframePath = './index.html';

  $scope.logout = function(){
    $http.post('http://'+url+':'+port+'/logout').then(function(response){console.log(response)})
  }

  $http.get('http://'+url+':'+port+'/getUserCompany').then(function(response){
    $scope.User = response.data.companies[0].company;
  })

  $scope.createNewFeature = function(redirect)
  {
    if (document.getElementById("metal").ckecked == true){
      $scope.metal = true;
    } else {$scope.metal = false;}
    if (document.getElementById("plastic").ckecked == true){
      $scope.plastic = true;
    } else {$scope.plastic = false;}

    var body ='{"label" : "' + $scope.label + '",  "attribution" : "' + $scope.attribution + '",  "component" : "' + $scope.component + '",  "compound" : "' + $scope.compound + '",  "ratio" : "' + $scope.ratio + '",  "material" : "' + $scope.material + '",  "heat_treatment" : "' + $scope.heat_treatment + '",  "surface_treatment" : "' + $scope.surface_treatment + '",  "width" : "' + $scope.width + '",  "lenght" : "' + $scope.lenght + '",  "height" : "' + $scope.height + '",  "volume" : "' + $scope.volume + '",  "manufacturing" : "' + $scope.manufacturing + '",  "tolerance" : "' + $scope.tolerance + '",  "rugosity" : "' + $scope.rugosity + '",  "comments" : "' + $scope.comments + '", "part_reference": "'+$scope.part_reference+'", "creation_date": "'+Date.now()+'", "product_name":"'+$scope.product_name+'", "metal":'+$scope.metal+', "plastic": '+$scope.plastic+'}';
    $http.post('http://'+url+':'+port+'/newFeatures/' + project, body).then(function(response) {
      console.log(JSON.stringify(response.data))
      console.log(JSON.stringify($scope.selectedFile))
      if($scope.selectedFile.length >0){
        var fileBody = '{"files":['
        for(i=0; i<$scope.selectedFile.length; i++){
          fileBody += '{"file":"'+$scope.selectedFile[i].document_name+'"},'
        }
        fileBody = fileBody.substr(0,fileBody.length-1);
        fileBody+=']}'
        $http.put('http://'+url+':'+port+'/setFileFeature/'+response.data[0].feature, fileBody).then(function(){
          if(redirect=="save"){
            window.location.href = "DisplayProject.html?"+project;
          } else {
            window.location.href = "NewFeatures.html?"+project;
          }
        })
      } else {
        window.location.href = "DisplayProject.html?"+project;
      }
    });
  } 

  $scope.CalculateVolume = function(){
    if($scope.width != undefined && $scope.height != undefined && $scope.lenght != undefined){
      $scope.volume = $scope.width * $scope.height * $scope.lenght
    }
  }

  $http.get('http://'+url+':'+port+'/getProjectFiles/'+project).then(function(response){
    for(i=0; i < response.data.length; i++){
      console.log(response.data[i ])
      if (response.data[i].feature==null){
        $scope.file.push(response.data[i])
      }
    }
    console.log($scope.file)
  })

  $scope.displayFile = function(index){
    var str = $scope.selectedFile[index].document_name
    var n = str.indexOf(".");
    if (str.substr(n+1) == "stp" || str.substr(n+1)=="step" || str.substr(n+1)=="stl"){
      setIFrame(str);
    } else {
      displayDCMEFiles(str)
    }
  }

  function displayDCMEFiles(file){
    $http.get('http://'+url+':'+port+'/getTicket').then(function(responseTicket){
      var ticket = responseTicket.data
      $http.get('http://'+url+':'+port+'/getFileIdProject/'+file+'/'+project).then(function(response){
        console.log(response.data)
        var storeType = response.data[0].adress_id.substr(0,9);
        var storeId = response.data[0].adress_id.substr(23);

        console.log('http://'+alf_url+':'+alf_port+'dcme/v1/alfresco/s/api/node/workspace/SpacesStore'+storeId+'/content?a=false&alf_ticket='+ticket)
        document.getElementById("pdfReader").src = 'http://'+alf_url+':'+alf_port+'/alfresco/s/api/node/workspace/SpacesStore/'+storeId+'/content?a=false&alf_ticket='+ticket
      })
    })
  }

  function setIFrame(fileName){
    document.getElementById('display3D').src = iframePath + '?' + fileName;
  }

  $scope.moveFile = function(index, table){
    if(table==1){
      $scope.selectedFile.push($scope.file[index]);
      $scope.file.splice(index, 1);
    } else {
      $scope.file.push($scope.selectedFile[index]);
      $scope.selectedFile.splice(index, 1);
    }
  }
  
  function getProject()
  {
    var str = window.location.search;
    str = str.substr(1);
    return str;
  }
});