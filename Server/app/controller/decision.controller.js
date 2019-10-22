app.controller('ProjectSummary', function($scope, $http, config) {
  const url = config.api_url; 
  const port = config.api_port;
  project = getProject();
  document.getElementById("returnToProject").href="DisplayProject.html?" + project
  var APRDecision;
  var APRComment;
  var TARDYDecision;
  var TARDYComment;
  var FinalDecision;
  var FinalComment;
  $http.get('http://'+url+':'+port+'/getProjectSummary/' + project, 
  {
    headers : 
    {'Content-Type' : 'application/json'}
    
  }).then(function(response) {
    $scope.ProjectName = project;
    $scope.Customer = response.data.project.company;
    $scope.projectFeatures = response.data.project.features;
  });

  $http.get('http://'+url+':'+port+'/getUserCompany').then(function(response){
    $scope.User = response.data.companies[0].company;
  })

  $http.get('http://'+url+':'+port+'/getDecision/' + project, {
    headers : 
    {'Content-Type' : 'application/json'}
    
  }).then(function(response){
    decision = response.data.decision;
    if (decision.APR_decision == 0)
    {
      document.getElementById("APRRefuse").style.backgroundColor = '#3596E8';
    }
    if (decision.APR_decision == 1)
    {
      document.getElementById("APRStand").style.backgroundColor = '#3596E8';
    }
    if (decision.APR_decision == 2)
    {
      document.getElementById("APRAccept").style.backgroundColor = '#3596E8';
    }
    if (decision.TARDY_decision == 0)
    {
      document.getElementById("TARDYRefuse").style.backgroundColor = '#3596E8';
    }
    if (decision.TARDY_decision == 1)
    {
      document.getElementById("TARDYStand").style.backgroundColor = '#3596E8';
    }
    if (decision.TARDY_decision == 2)
    {
      document.getElementById("TARDYAccept").style.backgroundColor = '#3596E8';
    }
    if (decision.Final_decision == 0)
    {
      document.getElementById("FinalRefuse").style.backgroundColor = '#3596E8';
    }
    if (decision.Final_decision == 1)
    {
      document.getElementById("FinalStand").style.backgroundColor = '#3596E8';
    }
    if (decision.Final_decision == 2)
    {
      document.getElementById("FinalAccept").style.backgroundColor = '#3596E8';
    }
    $scope.APRComment = decision.APR_comment;   
    $scope.TARDYComment = decision.TARDY_comment;
    $scope.FinalComment = decision.Final_comment;

    //final decision 
    if(decision.APR_decision != null && decision.TARDY_decision != null)
    {
      document.getElementById("finalDecision").style.display = "block";
    }
    else {
      document.getElementById("finalDecision").style.display = "none";
    }
  })

  $scope.logout = function(){
    $http.post('http://'+url+':'+port+'/logout').then(function(response){console.log(response)})
  }

  $scope.inputSubmitted = function(vdecision, input)
  {
    var decisionInput;
    if (input == "APRDecision")
    {
      $scope.APR_decision = vdecision;
      decisionInput = $scope.APR_decision;
      setDecision($scope.APR_decision, 'APR');
    }
    if (input == "TardyDecision")
    {
      $scope.TARDY_decision = vdecision;
      decisionInput = $scope.TARDY_decision;
      setDecision($scope.TARDY_decision, 'Tardy');
    }
    if (input == "FinalDecision")
    {
      $scope.Final_decision = vdecision;
      decisionInput = $scope.Final_decision;
      setDecision($scope.Final_decision, 'Final')
    }
    /*console.log('yolo '+decisionInput);
    if (decisionInput =! undefined && $scope.APRComment != undefined)
    {
      setDecision($scope.APR_decision, 'APR');
    }
    if (decisionInput =! undefined && $scope.TARDYComment != undefined)
    {
      setDecision($scope.TARDY_decision, 'Tardy');
    }
    if (decisionInput =! undefined && $scope.FinalComment != undefined)
    {
      setDecision($scope.Final_decision, 'Final');
    }*/
  }

  function setDecision (status, company) {
    if (company == "APR")
    {
      console.log("in set decision",$scope.APR_decision)
      console.log(status)
      var data = '{"column": "APR_decision", "value": ' + status + ',"commentColumn": "APRcomment", "comment":"' + $scope.APRComment + '"}'
    }
    if (company == "Tardy")
    {
      var data = '{"column": "TARDY_decision", "value": ' + status + ',"commentColumn": "TARDYcomment", "comment":"' + $scope.TARDYComment + '"}'
    }
    if (company == "Final")
    {
      var data = '{"column": "Final_decision", "value": ' + status + ',"commentColumn": "FinalComment", "comment":"' + $scope.FinalComment + '"}'
    }
    console.log(data);
    $http.post('http://'+url+':'+port+'/setDecision/'+ project, data, {
      headers : 
      {'Content-Type' : 'application/json'}
    }).then(function(response) {
      window.location.reload();
    });
    
  }


  function getProject()
  {
    var str = window.location.search;
    str = str.substr(1);
    return str;
  }
});