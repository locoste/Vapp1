var dateFormat = require('dateformat');
const https = require('https');
var http = require('http');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var FormData = require('form-data');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const alf_url = process.env.ALF_URL;
const alf_port = process.env.ALF_PORT;
const scan_url = process.env.SCAN_URL;
const scan_port = process.env.SCAN_PORT;
const odbc_url = process.env.ODBC_URL; 
const odbc_port = process.env.ODBC_PORT;
const apr_mail = process.env.APR_MAIL;
const tardy_mail = process.env.TARDY_MAIL;

exports.getUserCompany = function(req, res){
  var user = req.session.passport.user;
  var query = 'SELECT company FROM customer WHERE customer_id = ' + user
  odbcConnector(query,function(result){
    res.send(result);
  })
}

exports.favicon = function(req, res){
  res.writeHead(200, {"Content-Type": "image/png"});
  fs.readFile('../images/favicon.png', function(err, image){
    if(err){
      throw err;
    }
    res.write(image);
    res.end();
  })
}

exports.displayPage = function(req, res) {
  var page = req.params.page;
  if(page=='NewFeatures.html' || page=='updateFeatures.html' || page=='AcceptReject.html'){
    if(req.user.role!='admin' && req.user.role!='APR' && req.user.role!='TARDY'){
      page='Unauthorized.html'    
    }
  }
  if(page=='DisplayProject.html'){
    if(req.user.role!='admin' && req.user.role!='APR' && req.user.role!='TARDY'){
      page = 'DisplayProjectUser.html'
    }
  }
  if(page=='UserPage.html'){
    if(req.user.role=='admin' || req.user.role=='APR' || req.user.role=='TARDY'){
      page = 'AllUserPage.html'
    }
  }
  res.writeHead(200, {"Content-Type": "text/html"});
  fs.readFile('../View/'+page, function(err, html){
    if(err){  
      throw err;
    }
    res.write(html);
    res.end();
  })
}

exports.getCssFiles = function(req, res){
  var file = req.params.file;
  res.writeHead(200, {"Content-Type": "text/css"});
  fs.readFile('../View/css/'+file, function(err, css){
    if(err){  
      throw err;
    }
    res.write(css);
    res.end();
  })
}

exports.displayLoginPage = function(req, res) {
  var page = req.params.page;
  res.writeHead(200, {"Content-Type": "text/html"});
  fs.readFile('../View/login.html', function(err, html){
    if(err){
      throw err;
    }
    res.write(html);
    res.end();
  })
}

exports.createUserPage = function(req, res) {
  var page = req.params.page;
  res.writeHead(200, {"Content-Type": "text/html"});
  fs.readFile('../View/CreateUser.html', function(err, html){
    if(err){
      throw err;
    }
    res.write(html);
    res.end();
  })
}

exports.readpdf = function(req, res) {
  var page = req.params.page;
  res.writeHead(200, {"Content-Type": "text/html"});
  fs.readFile('../ressources/'+page, function(err, html){
    if(err){
      throw err;
    }
    res.write(html);
    res.end();
  })
}

exports.get3DScript = function(req, res) {
  var script = req.params.script;
  res.writeHead(200, {"Content-Type": "text/plain"});
  fs.readFile('../js/'+script, function(err, js){
    if(err){
      throw err;
    }
    res.write(js);
    res.end();
  })
}

exports.getController = function(req, res) {
  var script = req.params.script;
  res.writeHead(200, {"Content-Type": "text/plain"});
  if (script == 'Project.js'){
    fs.readFile('./app/'+script, function(err, js){
      if(err){
        throw err;
      }
      res.write(js);
      res.end();
    })
  }
  else {
    fs.readFile('./app/controller/'+script, function(err, js){
      if(err){
        throw err;
      }
      res.write(js);
      res.end();
    })
  }
}

exports.displayImages = function(req, res) {
  var image = req.params.image;
  res.writeHead(200, {"Content-Type": "image/jpg"});
  fs.readFile('../images/'+image, function(err, image){
    if(err){
      throw err;
    }
    res.write(image);
    res.end();
  })
}

exports.getUserDetails = function(req, res){
  if(req.user.role=='admin' || req.user.role=='APR' || req.user.role=='TARDY'){
    var query = 'SELECT DISTINCT customer_id, company, contact, email, phone_number FROM customer'
    odbcConnector(query, function(result){
      res.send(JSON.stringify(result));
    })
  } else {
    res.redirect('/Unauthorized.html')
  }
}

exports.getUserInformation = function(req, res){
  if(req.user.role=='admin' || req.user.role=='APR' || req.user.role=='TARDY'){
    var user = req.params.customerId
    var query = 'SELECT login, password, company, contact, email, phone_number FROM customer C LEFT JOIN users U on C.customer_id=U.customer WHERE customer_id='+user
    odbcConnector(query, function(result){
      res.send(JSON.stringify(result));
    })
  } else {
    res.redirect('/Unauthorized.html')
  }
}

exports.findAllProject = function(req, res) {
	var user = req.session.passport.user;
  var role = req.user.role
  if(role=='admin' || role=='APR' || role=='TARDY'){
    var query = 'SELECT project_name, project_description, C.company, expected_delivery, creation_date FROM Project P join Customer C on P.customer = C.customer_id JOIN users U on U.customer=C.customer_id ORDER BY creation_date, expected_delivery DESC'
  } 
  else if(role=='guest'){
    var query = 'SELECT project_name, project_description, C.company, expected_delivery, creation_date FROM Project P join Customer C on P.customer = C.customer_id JOIN users U on U.customer=C.customer_id WHERE user_id=' + user + ' ORDER BY creation_date, expected_delivery;'
  }
  odbcConnector(query, function(result){
   var row = '{"project": [';
   for (var i = 0; i < result.length; i++) {
    row = row + '{"projectName":"' + result[i].project_name + '",'
    row = row + '"projectDescription": "' + result[i].project_description + '",'
    row = row + '"company":"'+ result[i].company + '", '
    row = row + '"creation_date":"' + dateFormat(result[i].creation_date, "dd/mm/yyyy") + '",'
    row = row + '"expected_delivery":"' + dateFormat(result[i].expected_delivery, "dd/mm/yyyy") + '"},'
  }
  row = row.substr(0,row.length - 1);
  row = row + ']}'

  res.write(row);
  res.end();
});
}

exports.getprojectid = function(req, res) {
  var feature = req.params.feature;
  query = 'SELECT project_name FROM project P JOIN features F on P.project_id = F.project WHERE feature_id = ' + feature
  odbcConnector(query, function(result){
    var project_id = JSON.stringify(result);
    res.send(project_id);
  })
}

exports.getFeaturesForProject = function(req, res) {
	var project = req.params.project;
  checkPermission(req, res, function(){
   query = 'select * FROM features F JOIN project PR on F.project=PR.project_id WHERE project_name = "' + project +'";'
   odbcConnector(query, function(result) {
    var row = '{"features": [';
    for (var i = 0; i < result.length; i++) {
      row = row + '{"feature_id": ' + result[i].feature_id + ', '
      row = row + '"part_reference": "' + result[i].part_reference + '", '
      row = row + '"label": "' + result[i].label + '", '
      row = row + '"attribution": "' + result[i].attribution + '", '
      row = row + '"component": "' + result[i].component + '", '
      row = row + '"compound": "' + result[i].compound + '", '
      row = row + '"ratio": "' + result[i].ratio + '", '
      row = row + '"material": "' + result[i].material + '", '
      row = row + '"heat_treatment": "' + result[i].heat_treatment + '", '
      row = row + '"surface_treatment": "' + result[i].surface_treatment + '", '
      row = row + '"width": "' + result[i].width + '", '
      row = row + '"lenght": "' + result[i].lenght + '", '
      row = row + '"height": "' + result[i].height + '", '
      row = row + '"volume": "' + result[i].volume + '", '
      row = row + '"manufacturing": "' + result[i].manufacturing + '", '
      row = row + '"tolerance": "' + result[i].tolerance + '", '
      row = row + '"rugosity": "' + result[i].rugosity + '", '
      row = row + '"creation_date": "' + dateFormat(result[i].creation_date, "isoDate") + '", '
      row = row + '"feature_status": "' + result[i].feature_status + '", '
      row = row + '"comments": "' + result[i].comments + '"}, '
    }
    row = row.substr(0,row.length - 2);
    row = row + ']}'
    res.write(row);
    res.end();
  })
 });
}

exports.getFeatures = function(req, res) {
  var features = req.params.features;
  checkPermission(req, res, function(){
  //if(req.user.role=="admin"){
    query = 'select * from features where feature_id = '+ features
    odbcConnector(query, function(result) {
      var row = '{"features": [';
      for (var i = 0; i < result.length; i++) {
       row = row + '{"feature_id": ' + result[i].feature_id + ', '
       row = row + '"part_reference": "' + result[i].part_reference + '", '
       row = row + '"label": "' + result[i].label + '", '
       row = row + '"attribution": "' + result[i].attribution + '", '
       row = row + '"component": "' + result[i].component + '", '
       row = row + '"compound": "' + result[i].compound + '", '
       row = row + '"ratio": "' + result[i].ratio + '", '
       row = row + '"material": "' + result[i].material + '", '
       row = row + '"heat_treatment": "' + result[i].heat_treatment + '", '
       row = row + '"surface_treatment": "' + result[i].surface_treatment + '", '
       row = row + '"width": "' + result[i].width + '", '
       row = row + '"lenght": "' + result[i].lenght + '", '
       row = row + '"height": "' + result[i].height + '", '
       row = row + '"volume": "' + result[i].volume + '", '
       row = row + '"manufacturing": "' + result[i].manufacturing + '", '
       row = row + '"tolerance": "' + result[i].tolerance + '", '
       row = row + '"rugosity": "' + result[i].rugosity + '", '
       row = row + '"creation_date": "' + dateFormat(result[i].creation_date, "isoDate") + '", '
       row = row + '"feature_status": "' + result[i].feature_status + '", '
       row = row + '"comments": "' + result[i].comments + '"}, '
     }
     row = row.substr(0,row.length - 2);
     row = row + ']}'
     res.write(row);
     res.end();
   })
  });
}

exports.getProjectInformation = function(req, res) {
	var project = req.params.project;
	query = 'SELECT project_id, project_name, project_description,internal_reference, status, company, contact, email, phone_number, expected_delivery '
  + 'FROM Project P join Customer C on P.customer = C.customer_id WHERE project_name = "'+ project +'"';
  odbcConnector(query, function(result) {
    row = '{"project":{ "project_id":"' + result[0].project_id + '", '
    row = row + '"project_name": "' + result[0].project_name + '", '
    row = row + '"project_description": "' + result[0].project_description + '", '
    row = row + '"status": "' + result[0].status + '", '
    row = row + '"internal_reference": "' + result[0].internal_reference + '", '
    row = row + '"expected_delivery": "' + dateFormat(result[0].expected_delivery, "isoDate") + '", '
    row = row + '"customer": {"company": "' + result[0].company + '", '
    row = row + '"contact": "' + result[0].contact + '", '
    row = row + '"email": "' + result[0].email + '", '
    row = row + '"phone_number": "' + result[0].phone_number + '"}}}'
    
    res.write(row);
    res.end();
  })
}

exports.getCompanies = function (req, res) {
  var user = req.session.passport.user;
  query = 'SELECT DISTINCT company FROM customer C JOIN users U on C.customer_id=U.customer WHERE user_id='+user+';'
  odbcConnector(query, function(result) {
    var row = '{"companies": [';
    for (var i = 0; i < result.length; i++) {
      row = row + '{"company": "' + result[i].company + '", "login":"'+result[i].login+'"}, ';
    }
    row = row.substr(0, row.length -2);
    row = row + ']}'
    res.write(row);
    res.end();
  })
}

exports.getCustomerInformation = function(req, res) {
  var company = req.params.company;
  var user = req.user.customer
  query = 'SELECT contact, email, phone_number FROM customer WHERE customer_id = "' + user + '";';
  odbcConnector(query, function(result) {
    var row = '{"customer" : { "contact": "' + result[0].contact + '", '
    row = row + '"email": "' + result[0].email + '", '
    row = row + '"phone_number": "' + result[0].phone_number + '"}}'

    res.write(row);
    res.end();
  }) 
}

exports.createNewProject = function(req, res) {
  var project = req.body.project;
  var user = req.user.customer
  queryCheck = 'SELECT * FROM project WHERE project_name="'+project.projectName+'" AND customer='+user
  odbcConnector(queryCheck, function(resultCheck){
    if(resultCheck.length==0){
      console.log('1')
      query = 'INSERT INTO decision(rank_plastic, rank_metal, first_decision) VALUES (2,2,2);'
      odbcConnector(query, function() {
        console.log('2')
        var queryRef = "SELECT company , count(project_name) as nb FROM customer C join project P on C.customer_id=P.customer WHERE customer_id ="+user
        odbcConnector(queryRef, function(resultComp){
          console.log('3')
          var internalRef = resultComp[0].company.substr(0,3).toUpperCase() + project.projectName.substr(0,2).toUpperCase() + '-'+ resultComp[0].nb
          query = 'INSERT INTO project(project_name, project_description, customer, status, expected_delivery, decision, creation_date, internal_reference) VALUES ("' + project.projectName + '","' + project.projectDescription + '", '+user+',"'+ project.status+'", "'+dateFormat(project.expectedDelivery, "isoDate")+'", (SELECT max(decision_id) FROM decision), "'+dateFormat(new Date(), "isoDate")+'", "'+internalRef+'");'
          odbcConnector(query, function() {
            console.log('4')
            var folder = '{"managers":[{"manager":"Manager1"}],"folders":[{"Eid":"","name":"'+project.customer+'","subfolders":[{"Did":"","name":"'+project.projectName+'"}]}]}'
            DCMEfolder(folder, function(){
              console.log('5')
              var idDcmeQuery = 'SELECT id_dcme FROM customer WHERE customer_id = ' + user
              odbcConnector(idDcmeQuery, function(result){
                console.log('6')
                getIdFolder(project.projectName, result[0].id_dcme, function(response){
                  console.log('7')
                  var insertQuery = 'UPDATE project SET dcme_folder = "' + response + '" WHERE project_name="'+project.projectName+'"'
                  odbcConnector(insertQuery, function(){
                    console.log('8')
                    queryidproject='SELECT max(project_id) as projectid FROM project'
                    odbcConnector(queryidproject, function(resultidproject){
                      query = 'UPDATE product_quantity SET project='+resultidproject[0].projectid+' WHERE project is null'
                      odbcConnector(query, function(resultQuantity){
                        var jsonresult = '{"project":'+resultidproject[0].projectid+',"dcme_folder":"'+response+'"}'
                        sendEmail('New vf-OS project Submitted!', 'A new project has been submitted by '+project.company+ '. Please check on the application to see more details')
                        res.write(jsonresult);
                        res.end();
                      })
                    });
                  });
                });
              });
            });
          })
        })
      })
    } else {
      res.send('one of your project already named: '+project.projectName)
    }
  })
}

exports.updateProject=  function (req, res) {
  var projectid = req.params.project;
  var project = req.body.project;

  query = 'UPDATE project SET project_name = "' + project.project_name + '",internal_reference = "' + project.internal_reference + '",project_description = "' + project.project_description + '", customer = (SELECT customer_id FROM customer WHERE company = "' + project.customer + '" LIMIT 1) WHERE project_name = "'+ projectid +'";';
  odbcConnector(query, function() {
    res.write('project update');
    res.end();
  })
} 

exports.newFeatures = function(req, res) {
  var project = req.params.project;
  var features = req.body;
  var creation_date = dateFormat(Date.now(), "isoDate");

  checkPermission(req, res, function(){
    rankingMark(function(response){
      query = 'INSERT INTO features (label, attribution, component, compound, ratio, material, heat_treatment, surface_treatment, width, lenght, height, volume, manufacturing, tolerance, rugosity, comments, part_reference, creation_date, feature_status, metal, plastic, project, ranking)'
      + 'VALUES ("'+ features.label +'","'+ features.attribution +'","' + features.component+'", "' + features.compound+'", "' + features.ratio+'","' + features.material+'", "' + features.heat_treatment+'", "' + features.surface_treatment+'", "' + features.width +'", "' + features.lenght+'", "' + features.height+'", "' + features.volume+'", "' + features.manufacturing+'", "' + features.tolerance+'", "' + features.rugosity+'", "' + features.comments+'", "' + features.part_reference+'", "' + creation_date+'","Submitted",'+features.metal+','+features.plastic+',(SELECT project_id FROM project WHERE project_name="'+project+'"),'+response+');';
      odbcConnector(query, function(result1){
        var queryMax = 'SELECT max(feature_id) as feature FROM features'
        odbcConnector(queryMax, function(result){
          res.write(JSON.stringify(result));
          res.end();
        })
      });
    })
  });
}

exports.deleteFeature = function(req, res){
  var feature = req.params.feature;
  checkPermission(req, res, function(){
    var query = 'DELETE FROM features WHERE feature_id='+feature;
    odbcConnector(query, function(result){
      var query = 'UPDATE documents SET feature=null WHERE feature='+feature
      odbcConnector(query, function(){
        res.send('feature deleted with success!!')
      })
    })
  });
}

exports.updateFeatures = function(req, res) {
  var features = req.body;
  checkPermission(req, res, function(){
    rankingMark(function(response){

      query = 'UPDATE features SET label = "' + features.label + '", attribution = "' + features.attribution + '", component = "' + features.component + '", compound = "' + features.compound + '", ratio = "' + features.ratio + '", material = "' + features.material + '", heat_treatment = "' + features.heat_treatment + '", surface_treatment = "' + features.surface_treatment + '", width = "' + features.width + '", lenght = "' + features.lenght + '", height = "' + features.height + '", volume = "' + features.volume + '", manufacturing = "' + features.manufacturing + '", tolerance = "' + features.tolerance + '", rugosity = "' + features.rugosity + '", comments = "' + features.comments + '", part_reference = "' + features.part_reference + '", modification_date = "' + dateFormat(Date.now(), "isoDate") + '" , ranking='+response+'  WHERE feature_id = ' +features.feature_id
      odbcConnector(query, function(){

        res.write('features updated');
        res.end();
      })
    })
  });
}

exports.getProductInformation = function(req, res) {
  var feature = req.params.feature;
  var row = '{ "project" : "';
  query = 'SELECT project_name, part_reference, metal, plastic FROM project P join features F on P.project_id=F.project WHERE feature_id = ' + feature
  odbcConnector(query, function(result){
    row += result[0].project_name + '",'
    row += '"product": { "product_name": "'+ result[0].part_reference + '",'
    row += '"metal": "' + result[0].metal +'", ' + '"plastic": "' + result[0].plastic + '"}}'
    res.write(row);
    res.end();
  })
}

exports.getQuantities = function(req, res)
{
  var project = req.params.project;
  var row = '{"quantities":[ ';
  query = 'SELECT quantity_id, Q.quantity , lot_size, number_of_lot, default_label FROM product_quantity Q join project P on Q.project = P.project_id WHERE project_name = "' + project + '";'
  odbcConnector(query, function(result){
    for (var i = 0; i < result.length; i++) {
      row = row + '{"quantity_id":"' + result[i].quantity_id + '",'
      row = row + '"quantity": "' + result[i].quantity + '",'
      row = row + '"lot_size":"' + result[i].lot_size + '",'
      row = row + '"number_of_lot":"' + result[i].number_of_lot + '",'
      row = row + '"default_label":"' + result[i].default_label + '"},'
    }
    row = row.substr(0,row.length - 1);
    row = row + ']}'

    res.write(row);
    res.end();
  })
}

exports.getQuantitiesWithoutProject = function(req, res){
  query = 'SELECT quantity_id, quantity , lot_size, number_of_lot, default_label FROM product_quantity WHERE project is null;'
  var row = '{"quantities":[ ';
  odbcConnector(query, function(result){
    for (var i = 0; i < result.length; i++) {
      row = row + '{"quantity_id":"' + result[i].quantity_id + '",'
      row = row + '"quantity": "' + result[i].quantity + '",'
      row = row + '"lot_size":"' + result[i].lot_size + '",'
      row = row + '"number_of_lot":"' + result[i].number_of_lot + '",'
      row = row + '"default_label":"' + result[i].default_label + '"},'
    }
    row = row.substr(0,row.length - 1);
    row = row + ']}'

    res.write(row);
    res.end();
  })
}

exports.newQuantity = function(req, res){
  var project = req.params.project;
  var bodyquantity = req.body.quantity;
  query = 'INSERT INTO product_quantity(quantity, lot_size, number_of_lot, default_label, project) VALUES (' + bodyquantity.quantity + ', ' + bodyquantity.lot_size + ', ' + bodyquantity.number_of_lot + ', "' + bodyquantity.default_label + '", (SELECT project_id FROM project WHERE project_name = "'+ project +'"))'
  //odbcConnector(query, function(){});
  //query = 'UPDATE project SET quantity = (SELECT max(quantity_id) FROM product_quantity) WHERE project_name = "' + project + '";'
  odbcConnector(query, function(){
    res.write("quantity added!!!!");
    res.end();
  })
}

exports.newQuantityWithoutProject = function(req, res){
  var quantity = req.body.quantity
  //var user = res.user.id;
  query = 'INSERT INTO product_quantity(quantity, lot_size, number_of_lot, default_label) VALUES (' + quantity.quantity + ', ' + quantity.lot_size + ', ' + quantity.number_of_lot + ', "' + quantity.default_label + '")'
  odbcConnector(query, function(result){
    res.send(result);
  })
}

exports.getDecision = function(req, res) {
  var project = req.params.project;
  checkPermission(req, res, function(){
    var row = '{"decision":';
    var query = 'select decision_id, rank_metal, rank_plastic, first_decision, APR_decision, APRcomment, TARDY_decision, TARDYcomment, Final_decision, FinalComment from decision D join project P on D.decision_id=P.decision where project_name="' + project + '";'
    odbcConnector(query, function(result) {
      if (result.length > 0)
      {
        row += '{"decision_id":' + result[0].decision_id + ','
        row += '"rank_metal":' + result[0].rank_metal + ','
        row += '"rank_plastic":' + result[0].rank_plastic + ','
        row += '"first_decision":' + result[0].first_decision + ','
        row += '"APR_decision":' + result[0].APR_decision + ','
        row += '"APR_comment":"' + result[0].APRcomment + '",'
        row += '"TARDY_decision":' + result[0].TARDY_decision + ','
        row += '"TARDY_comment":"' + result[0].TARDYcomment + '",'
        row += '"Final_comment":"' + result[0].FinalComment + '",'
        row += '"Final_decision":' + result[0].Final_decision + '}}'
      }
      res.write(row);
      res.end();
    })
  });
}

exports.setDecision = function (req, res) {
  var Partner;
  var project = req.params.project;
  var decision = req.body;
  var auth = true;
  switch(decision.column){
    case 'APR_decision':
    Partner = 'APR';
    if(req.user.role != 'APR'){
      auth = false;
    }
    break;
    case 'TARDY_decision':
    Partner = 'TARDY';
    if(req.user.role != 'TARDY'){
      auth = false;
    }
    break;
    case 'Final_decision':
    Partner = 'Final ';
    if(req.user.role != 'APR' || req.user.role != 'TARDY'){
      auth = false;
    }
    break;
  }
  if(auth==true){
    checkPermission(req, res, function(){
      var query = 'UPDATE decision SET ' + decision.column + ' = ' + decision.value + ', ' + decision.commentColumn + ' = "' + decision.comment + '" WHERE decision_id = (SELECT decision FROM project WHERE project_name = "' + project + '");' 
      odbcConnector(query, function(){
        var decisionValue;
        switch(decision.value) {
          case 0: 
          decisionValue = 'The project is refused'
          break;
          case 1: 
          decisionValue = 'The project is in stand by'
          break;
          case 2: 
          decisionValue = 'The project is Accepted'
          break;
        }
        sendEmail('A decision has been set', decisionValue + ' by '+ Partner);
        res.end();
      })
    });
  } else {
    res.status(401).send();
  }
}

exports.projectSummary = function(req, res) {
  var project = req.params.project;
  var query = 'SELECT company, part_reference, label, ranking FROM project P JOIN customer C on P.customer=C.customer_id JOIN features F on P.project_id = F.project WHERE project_name = "' + project + '";'
  odbcConnector(query, function(result) {
    var row = '{"project": {'
    row += '"company": "' + result[0].company + '",'
    row += '"features":['
    for (i = 0; i < result.length; i++)
    {
      row += '{"part_reference": "' + result[i].part_reference + '",'
      row += '"label": "' + result[i].label + '",'
      row += '"ranking":"' + result[i].ranking + '%"},'
    }
    row = row.substr(0,row.length - 1);
    row = row + ']}}'
    res.write(row);
    res.end();
  })
}

exports.getFiles = function(req, res){
  var feature = req.params.feature;
  query = 'SELECT document_name, feature FROM documents WHERE feature is null AND project = (SELECT project FROM features WHERE feature_id =' + feature +') UNION SELECT document_name, feature FROM documents WHERE feature='+feature;
  odbcConnector(query, function(result){
    res.write(JSON.stringify(result));
    res.end();
  })
}

exports.deleteFile = function(req, res){
  var file = req.params.file;
  var project = req.params.project;
  var user = req.user.customer
  var query='DELETE FROM documents WHERE document_name="'+file+'" AND project=(SELECT project_id FROM project WHERE project_name="'+project+'" AND customer='+user+')';
  odbcConnector(query, function(result){
    res.send('document "'+file+'" delted with success');
  })
}

exports.getProjectFiles = function(req, res){
  var project = req.params.project;
  var user = req.user.customer
  query = 'SELECT document_name, feature, adress_id FROM documents WHERE project = (SELECT project_id FROM project WHERE project_name ="' + project +'")';
  odbcConnector(query, function(result){
    res.write(JSON.stringify(result));
    res.end();
  })
}

exports.newFile = function(req, res){
  var project  = req.params.project;
  var doc = req.body;
  var scanid;
  if(doc.type == "3DScan"){
    https.get('https://'+scan_url+':'+scan_port+'/3dscan/v1/sqlrest/webgl/',{rejectUnauthorized:false}, (response) => {
      let data = '';

      // A chunk of data has been recieved.
      response.on('data', (chunk) => {  
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      response.on('end', () => {
        var filesid = parseString(data, function (err, result) {
          var count = Object.keys(result.webglList.webgl).length;
          scanid = Number(result.webglList.webgl[count-1]._);
          console.log('scanid of '+doc.document_name+': ' + scanid)
          var query = 'INSERT INTO documents (document_name, dcme_3dscan, adress_id, project) VALUES ("'+ doc.document_name +'", "'+doc.type+'", '+ scanid +', '+project+')'
          odbcConnector(query, function(result){
            console.log(result)
            res.write("saved!!");
            res.end();
          })
        })
      });        
    })
  } else {
    console.log(doc)
    var query = 'INSERT INTO documents (document_name, dcme_3dscan, adress_id, project) VALUES ("'+ doc.document_name +'", "'+doc.type+'", "'+ doc.nodeRef +'", '+project+')'
    odbcConnector(query, function(result){
      console.log(result)
      res.write("saved!!");
      res.end();
    })
  }
}

exports.getFileId = function(req, res){
  var file = req.params.file;
  var feature = req.params.feature
  var query = 'SELECT adress_id FROM documents WHERE document_name = "' + file + '" AND feature = ' + feature
  odbcConnector(query, function(result){
    res.send(JSON.stringify(result));
  }) 
}

exports.getFileIdProject = function(req, res){
  var file = req.params.file;
  var project = req.params.project
  var user = req.user.customer
  var query = 'SELECT adress_id FROM documents WHERE document_name = "' + file + '" AND project = (SELECT project_id FROM project WHERE project_name="' + project + '" AND customer='+user+')'
  odbcConnector(query, function(result){
    res.send(JSON.stringify(result));
  }) 
}

exports.getProjectDCMEId = function(req, res){
  var project = req.params.project;
  var user = req.user.customer;
  var query = 'SELECT dcme_folder FROM project WHERE project_name="'+project+'" AND customer='+user
  console.log(query)
  odbcConnector(query, function(result){
    res.send(JSON.stringify(result));
  })
}

exports.getLocalSTLFile = function(req, res){
  var file = req.params.file;
  fs.readFile('./Sources/files/' + file, function (err, data) {
    if (err) {
      throw err; 
    }
    res.write(data);
    res.end();
  });
}

exports.createUser = function(req, res){
  var user=req.body;
  var folder = '{"managers":[{"manager":"Manager1"}],"folders":[{"Eid":"","name":"'+user.company+'"}]}'
  let ticket;
  query1 = 'INSERT INTO customer (company, contact, email, phone_number) VALUES ("'+user.company+'","'+user.contact+'","'+user.email+'","'+user.phone_number+'");'
  odbcConnector(query1, function(result){
    query2 = 'INSERT INTO users (login, password, customer, role) VALUES ("'+user.login+'","'+user.password+'",(SELECT max(customer_id) FROM customer), "guest")'
    odbcConnector(query2, function(result){

      DCMEfolder(folder, function(){

        var id = getIdFolder(user.company,'-root-', function(idFolder){
          var queryMax = 'SELECT max(customer_id) as customer FROM customer'
          odbcConnector(queryMax, function(result){
            var queryId = 'UPDATE customer SET id_dcme = "' + idFolder + '" WHERE customer_id = ' + result[0].customer
            odbcConnector(queryId, function(result2){console.log(result2);res.send('done');});
          });

        });
      });
    })
  }
  )
}

exports.updateUser =function(req, res){
  var company = req.user.customer;
  var user = req.body;
  var query = 'UPDATE customer SET company ="'+user.company+'",email="'+user.email+'",contact="'+user.contact+'",phone_number="'+user.phone_number+'" WHERE customer_id = ' + company;
  odbcConnector(query,function(result){
    if(user.password==undefined){
      var loginquery = 'UPDATE users SET login = "'+user.email+'",password = "'+user.password+'" WHERE customer = '+ company
    } else {
      var loginquery = 'UPDATE users SET login = "'+user.login+'" WHERE customer = '+ company
    }
    odbcConnector(loginquery, function(){
      res.send('user updated')
    })
  })
}

exports.updateCustomerRole = function(req, res){
  if(req.user.role=='admin' || req.user.role=='APR' || req.user.role=='TARDY'){
    var body=req.body;
    var query='UPDATE users SET role="'+body.role+'" WHERE customer='+body.customer_id
    odbcConnector(query, function(result){
      res.end()
    })
  } else {
    res.send("You're not allow to do that");
  }
}

exports.fileNodeRef = function(req, res){
  var fileName = req.params.fileName;
  var nodeRef = req.body;
  var query = 'UPDATE documents SET dcme_path = "'+nodeRef.nodeRef+'" WHERE pdf_name = "' + fileName + '";'
  odbcConnector(query, function(result){
    res.send(JSON.parse(result));
  })
}

exports.updateFileFeature = function(req, res){
  var body = req.body;
  var feature = req.params.feature
  var query = 'UPDATE documents SET feature = ' + body.feature + ' WHERE document_name = "' +body.file+'" AND project=(SELECT project FROM features WHERE feature_id = ' + feature + ')'
  odbcConnector(query, function(result){
    res.send(body.file + " as been update at feature "+ body.feature);
  })
}

exports.setFileFeature = function(req, res){
  var file = req.body;
  var feature = req.params.feature 
  for(i=0; i<file.files.length; i++){
    console.log(file);
    var query = 'UPDATE documents SET feature = ' + feature + ' WHERE document_name = "' +file.files[i].file+'" AND project=(SELECT project FROM features WHERE feature_id = ' + feature + ')'
    odbcConnector(query, function(result){})
  }
  res.send('update are done');
}

exports.postDCMEId = function(req, res){
  var body=req.body;
  var project = req.params.project;
  var user = req.user.customer;
  getIdFolder(body.document, body.parent, function(response){
    var query = 'INSERT INTO documents(document_name, dcme_3dscan, adress_id, project) VALUES ("'+body.document+'", "DCME", "'+response+'", (SELECT project_id FROM project WHERE project_name="'+project+'" AND customer='+user+'))'
    odbcConnector(query, function(result){
      res.send('document uploaded!!')
    })
  })
}

function rankingMark (callback){
  var project =  req.params.project;
  var min = 50;
  var max = 90;
  var mark = Math.random() * (max - min) + min;
  callback(mark);
}

function getIdFolder(company, parentid, callback){
  const initLogin = {
    host : alf_url,
    path: '/alfresco/s/api/login',
    port: alf_port,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const bodyLogin = '{"username":"admin", "password":"ADMIN"}'

  const loginCallback = function(response) {
    console.log('inside')
    let str = '';
    var tamp;
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function(){
      tamp = JSON.parse(str);
      ticket = tamp.data.ticket;
      console.log(ticket)
      console.log(parentid)

      const idLogin = {
        host : alf_url,
        path: '/alfresco/api/-default-/public/alfresco/versions/1/nodes/'+parentid+'/children?alf_ticket='+ticket,
        port: alf_port,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };  

      const idCallback = function(response) {
        let str = '';
        var tampId;
        response.on('data', function(chunk) {
          str += chunk;
        });

        response.on('end', function(){
          var tampId = JSON.parse(str);
          console.log(tampId)
          var customerFolder = tampId.list.entries;
          console.log(customerFolder)
          for (i = 0; i<customerFolder.length; i ++) {
            if(customerFolder[i].entry.name==company){
              console.log(customerFolder[i].entry.name)
              callback(customerFolder[i].entry.id);
            }
          }
        })
      }

      const idReq = http.request(idLogin, idCallback);
      idReq.end();
    });
  };

  const logReq = http.request(initLogin, loginCallback);
  logReq.write(bodyLogin);
  logReq.end();
}


exports.getTicket = function (req, res){
  const initLogin = {
    host : alf_url,
    path: '/alfresco/s/api/login',
    port: alf_port,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const bodyLogin = '{"username":"admin", "password":"ADMIN"}'

  const loginCallback = function(response) {
    let str = '';
    var tamp;
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function(){
      tamp = JSON.parse(str);
      ticket = tamp.data.ticket;
      res.send(ticket);
    });

    
  }
  const logReq = http.request(initLogin, loginCallback);
  logReq.write(bodyLogin);
  logReq.end();
}

exports.getDCMEId = function(req, res){
  var feature = req.params.feature
  var query = 'SELECT dcme_folder FROM project P JOIN features F on P.project_id = F.project WHERE feature_id = ' + feature
  odbcConnector(query, function(result){res.send(result[0].dcme_folder)});
}

function DCMEfolder(body, callback){

  const initLogin = {
    host : alf_url,
    path: '/alfresco/s/api/login',
    port: alf_port,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const bodyLogin = '{"username":"admin", "password":"ADMIN"}'

  const loginCallback = function(response) {
    let str = '';
    var tamp;
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function(){
      tamp = JSON.parse(str);
      ticket = tamp.data.ticket;
      console.log('ticket: '+ticket)

      const init = {
        host : alf_url,
        path: '/alfresco/s/api/folders?alf_ticket='+ticket,
        port: alf_port,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const callbackFolder = function(response) {
        let str = '';
        response.on('data', function(chunk) {
          str += chunk;
        });

        response.on('end', function(){
          callback();
        });
      };
      console.log(init.path)
      const foldReq = http.request(init, callbackFolder);
      foldReq.write(body);
      foldReq.end();
    });
  };
  console.log(initLogin.host+':'+initLogin.port+initLogin.path)
  const logReq = http.request(initLogin, loginCallback);
  logReq.write(bodyLogin);
  logReq.end();
}

function checkPermission(req, res, callback){
  var role = req.user.role;
  if (role == 'admin' || role=='APR' || role=='TARDY'){
    callback();
  } else {
    res.status(401).send();
  }
}

function odbcConnector(request, callback){
  console.log(request)
  try{
    const id = {
      host : odbc_url,
      //path: '/odbc/v1/api/odbcModels/requestdb?request='+escape(request),
      path: '/api/odbcModels/requestdb?request='+escape(request),
      port: odbc_port,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };  

    const idCallback = function(response) {
      let str = '';
      response.on('data', function(chunk) {
        str += chunk;
      });

      response.on('end', function(){
        var result = JSON.parse(str)
        callback(result.request);
      })
    }

    const idReq = http.request(id, idCallback);
    idReq.end();
  }
  catch(e){
    console.log(e)
  }
}

function sendEmail(object, text){
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'louis.coste69@gmail.com',
      pass: 'Lamoule07130'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  var mailOptions = {
    from: 'louis.coste69@gmail.com',
    to: apr_mail+', '+tardy_mail,
    subject: object,
    text: text
  };

  console.log('transporter:')
  console.log(transporter);
  console.log('mailOptions: ')
  console.log( mailOptions);

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    transporter.close();
  });
}