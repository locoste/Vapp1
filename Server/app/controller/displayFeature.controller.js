app.controller('DisplayFeatures', function($scope, $http, config) {
  const url = config.api_url;
  const port = config.api_port;
  const alf_url = config.alf_url;
  const alf_port = config.alf_port;
  const scan_url = config.scan_url;
  const scan_port = config.scan_port;
  var feature = getProject();
  $scope.file = [];
  $scope.selectedFile = [];
  var iframePath = './index.html';
  $http.get('http://'+url+':'+port+'/getFeatures/' + feature, 
  {
    headers : 
    {'Content-Type' : 'application/json'}
    
  }).then(function(response) {
    if (response.data != '{"features":]}')
    {
      $scope.part_reference = response.data.features[0].part_reference;
      $scope.label = response.data.features[0].label;
      $scope.attribution = response.data.features[0].attribution;
      $scope.component = response.data.features[0].component;
      $scope.compound = response.data.features[0].compound;
      $scope.ratio = response.data.features[0].ratio;
      $scope.material = response.data.features[0].material;
      $scope.heat_treatment = response.data.features[0].heat_treatment;
      $scope.surface_treatment = response.data.features[0].surface_treatment;
      $scope.width = response.data.features[0].width;
      $scope.lenght = response.data.features[0].lenght;
      $scope.height = response.data.features[0].height;
      $scope.volume = response.data.features[0].volume;
      $scope.manufacturing = response.data.features[0].manufacturing;
      $scope.tolerance = response.data.features[0].tolerance;
      $scope.rugosity = response.data.features[0].rugosity;
      $scope.comments = response.data.features[0].comments;
    }
  });

  $http.get('http://'+url+':'+port+'/getDocuments/'+feature).then(function(response){
    for(i=0; i < response.data.length; i++){
      console.log(response.data[i ])
      if (response.data[i].feature==null){
        $scope.file.push(response.data[i])
      } else {
        $scope.selectedFile.push(response.data[i])
      }
    }
    console.log($scope.file)
  })

  $http.get('http://'+url+':'+port+'/getUserCompany').then(function(response){
    $scope.User = response.data.companies[0].company;
  })

  $http.get('http://'+url+':'+port+'/getProductInformation/'+feature).then(function(response) {
    $scope.product_name = response.data.product.product_name;
    if (response.data.product.metal == 1)
    {
      document.getElementById("metal").ckecked == true
    }
    if (response.data.product.plastic == 1)
    {
      document.getElementById("plastic").ckecked == true
    }
    document.getElementById("returnButton").href = "DisplayProject.html?" + response.data.project;
    document.getElementById("saveButton").href = "DisplayProject.html?" + response.data.project;
    document.getElementById("addNewFeature").href = "NewFeatures.html?"+response.data.project;
  })

    /*$http.get('http://'+url+':'+port+'/getDocuments/'+feature).then(function(response){
      $scope.documents = response.data;
      document.getElementById('display3D').src = iframePath + '?' + response.data[response.data.length-1].name_3d
    })*/

    $scope.logout = function(){
      $http.post('http://'+url+':'+port+'/logout').then(function(response){console.log(response)})
    }

    $scope.submitStepFile = function()
    {
      

      var fd = new FormData();
      fd.append('file', document.getElementById('fileInput').files[0]);
      var uploadUrl = 'https://'+scan_url+':'+scan_port+'/3dscan/v1/FitmanGL/rest/post/upload';

      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
      .then(function(response){
        console.log(response.data)
        document.getElementById('display3D').src = iframePath + '?' + document.geElementById('fileInput').files[0].name;
      });

      
        // get ticket for DCME
        $http.get('http://'+url+':'+port+'/getTicket').then(function(response){
          var ticket = response.data

          // get DCME folder id  
          $http.get('http://'+url+':'+port+'/getDCMEId/'+feature).then(function(responseid){

            // uploading file
            var form = new FormData();
            form.append('filedata', document.getElementById('pdfInput').files[0]);
            form.append('destination','workspace://SpacesStore/'+responseid.data)
            var uploadDCMEUrl = 'http://'+alf_url+':'+alf_port+'/alfresco/service/api/upload?alf_ticket='+ticket;

            $http.post(uploadDCMEUrl, form, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).then(function(responseNode){
              alert("cacahuete");
              console.log(responseNode.data.nodeRef);
              body='{"step_name": "'+ document.getElementById('fileInput').files[0].name +'", "nodeRef":"'+responseNode.data.nodeRef+'","pdf_name": "'+document.getElementById('pdfInput').files[0].name+'"}'
              $http.post('http://'+url+':'+port+'/newFile/' + feature, body).then(function(response){
                alert("documents saved!!!");
              })
            })
          })
        })
        //document.getElementById('pdfReader').src=document.getElementById('pdfInput').files[0]
      }

      $scope.CalculateVolume = function(){
        if($scope.width != undefined && $scope.height != undefined && $scope.lenght != undefined){
          $scope.volume = $scope.width * $scope.height * $scope.lenght
        }
      }

      $scope.updatefeature = function()
      {
        var body ='{ "feature_id" : "' + feature + '",  "label" : "' + $scope.label + '",  "attribution" : "' + $scope.attribution + '",  "component" : "' + $scope.component + '",  "compound" : "' + $scope.compound + '",  "ratio" : "' + $scope.ratio + '",  "material" : "' + $scope.material + '",  "heat_treatment" : "' + $scope.heat_treatment + '",  "surface_treatment" : "' + $scope.surface_treatment + '",  "width" : "' + $scope.width + '",  "lenght" : "' + $scope.lenght + '",  "height" : "' + $scope.height + '",  "volume" : "' + $scope.volume + '",  "manufacturing" : "' + $scope.manufacturing + '",  "tolerance" : "' + $scope.tolerance + '",  "rugosity" : "' + $scope.rugosity + '",  "comments" : "' + $scope.comments + '",  "part_reference" : "' + $scope.part_reference + '"}';
        $http.put('http://'+url+':'+port+'/updateFeatures/',body).then(function(response){
          $scope.updatefeature = "features updated!";
        });
      }

      $scope.displayFile = function(index){
        var str = $scope.selectedFile[index].document_name
        var n = str.indexOf(".");
        if (str.substr(n+1) == "stp" || str.substr(n+1)=="step" || str.substr(n+1)=="stl"){
          setIFrame(str);
        } else {
        // download on dcme
        displayDCMEFiles(str)
      }
    }

    function setIFrame(fileName){
      document.getElementById('display3D').src = iframePath + '?' + fileName;
    }

    function displayDCMEFiles(file){
      $http.get('http://'+url+':'+port+'/getTicket').then(function(responseTicket){
        var ticket = responseTicket.data
        $http.get('http://'+url+':'+port+'/getFileId/'+file+'/'+feature).then(function(response){
          console.log(response.data)
          var storeType = response.data[0].adress_id.substr(0,9);
          var storeId = response.data[0].adress_id.substr(11);
          //document.getElementById("pdfReader").src = 'http://'+scan_url+':'+scan_port+'dcme/v1/alfresco/s/api/node/workspace/SpacesStore'+storeId+'/content?a=false&alf_ticket='+ticket
          document.getElementById("pdfReader").src = 'http://'+alf_url+':'+alf_port+'/alfresco/s/api/node/workspace/SpacesStore'+storeId+'/content?a=false&alf_ticket='+ticket
        })
      })
    }

    $scope.moveFile = function(index, table){
      if(table==1){
        var body = '{"file":"'+$scope.file[index].document_name+'","feature":'+feature+'}'
        $http.put('http://'+url+':'+port+'/updateFileFeature/'+feature,body).then(function(response){
          console.log(response.data)
          $scope.selectedFile.push($scope.file[index]);
          $scope.file.splice(index, 1);
        });
      } else {
        var body = '{"file":"'+$scope.selectedFile[index].document_name+'","feature":'+null+'}'
        console.log(body)
        $http.put('http://'+url+':'+port+'/updateFileFeature/'+feature,body).then(function(response){
          console.log(response.data)
          $scope.file.push($scope.selectedFile[index]);
          $scope.selectedFile.splice(index, 1);
        });
      }
    }
    

    function getProject()
    {
      var str = window.location.search;
      str = str.substr(1);
      return str;
    }
  }); 