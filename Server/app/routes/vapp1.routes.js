module.exports = function(app) {

    var controller = require('../controller/vapp1.controller.js');
    var contSession = require('../controller/vapp1.session.js');

    var bodyParser = require('body-parser');
    const uuid = require('uuid/v4')
    var session = require('express-session');
    var cookieParser = require('cookie-parser');
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    var MySQLStore = require('express-mysql-session')(session);
    var busboy = require('connect-busboy');

    var fs = require('fs');

    var options = {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_SCHEMA
    };

    var sessionStore = new MySQLStore(options);

    app.all("/*", function(req, res, next){
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With');
      next();
    });

    app.use(bodyParser.urlencoded({limit:'50mb', extended: true }))
    app.use(bodyParser.json({limit:'50mb'}))

    app.use(session({
    genid: (req) => {
      console.log('Inside session middleware genid function')
      console.log(`Request object sessionID from client: ${req.sessionID}`)
      return uuid() // use UUIDs for session IDs
    },
    store: sessionStore,
    secret: 'vfosvappone',
    resave: true,
    rolling:true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000}
  }))

    app.use(passport.initialize());
    app.use(passport.session());

 
    // redirecting 
    app.get('/', contSession.authrequired, contSession.redirecting);

    // Display login page
    app.get('/login.html', controller.displayLoginPage);

    // login
    app.post('/login', contSession.loginUser);

    // log out
    app.post('/logout', contSession.logoutUser);

    // display login controller
    app.get('/controller/:script', controller.getController);

    // display all login page images
    app.get('/images/:image', controller.displayImages);

    // get css files
    app.get('/css/:file', controller.getCssFiles);

    // get favicon.ico
    app.get('/favicon.ico', controller.favicon)

    // display all project page
    app.get('/Vapp1/:page', contSession.authrequired, controller.displayPage);

    //app.get('/Vapp1/readpdf/:page', controller.readpdf);

    // get 3D script 
    app.get('/Vapp1/js/:script', contSession.authrequired, controller.get3DScript);

    // display all project page
    app.get('/Vapp1/controller/:script', contSession.authrequired, controller.getController);

    // display all images
    app.get('/Vapp1/images/:image', contSession.authrequired, controller.displayImages);

    // display all project
    app.get('/AllProjectInformation', contSession.authrequired, controller.findAllProject);

    //get all features for a project
    app.get('/features/:project', contSession.authrequired, controller.getFeaturesForProject);

    // delete a project feature
    app.delete('/deleteFeature/:feature', contSession.authrequired, controller.deleteFeature);

    // get features from upload features
    app.get('/getFeatures/:features', contSession.authrequired, controller.getFeatures);

    //get project information
    app.get('/getProject/:project', contSession.authrequired, controller.getProjectInformation);

    //get all companies
    app.get('/getCompanies', contSession.authrequired, controller.getCompanies);

    //get customer information in function of a company
    app.get('/getCompanyInformation/:company', contSession.authrequired, controller.getCustomerInformation);

    //create a new project
    app.post('/newProject', contSession.authrequired, controller.createNewProject);

    //update a project
    app.put('/updateProject/:project', contSession.authrequired, controller.updateProject);

    // create new features
    app.post('/newFeatures/:project', contSession.authrequired, controller.newFeatures);

    // update features
    app.put('/updateFeatures', contSession.authrequired, controller.updateFeatures);

    // get product and project information for features
    app.get('/getProductInformation/:feature', contSession.authrequired, controller.getProductInformation);

    // get all quantities for a project
    app.get('/getQuantities/:project', contSession.authrequired, controller.getQuantities);

    // get all quantities on project creation 
    app.get('/getQuantities', contSession.authrequired, controller.getQuantitiesWithoutProject);

    // add a new quantity for a project
    app.post('/newQuantity/:project', contSession.authrequired, controller.newQuantity);

    // add a new quantity on project creation
    app.post('/newQuantity', contSession.authrequired, controller.newQuantityWithoutProject);

    // delete quantity with id
    app.delete('/deleteQuantity/:quantityId', contSession.authrequired, controller.deleteQuantity)

    // delete quantity if the project is not created
    app.delete('/deleteQuantityBackProject', contSession.authrequired, controller.deleteQuantityBackProject);

    // get decision for a project
    app.get('/getDecision/:project', contSession.authrequired, controller.getDecision);

    //set new decision on a project
    app.post('/setDecision/:project', contSession.authrequired, controller.setDecision);

    // get Project Summary for decision
    app.get('/getProjectSummary/:project', contSession.authrequired, controller.projectSummary);

    // get step document for a feature
    app.get('/getDocuments/:feature', contSession.authrequired, controller.getFiles);

    // get documents for a project
    app.get('/getProjectFiles/:project', contSession.authrequired, controller.getProjectFiles);

    // New setp file for project
    app.post('/newFile/:project', contSession.authrequired, controller.newFile);

    // delete file from project
    app.delete('/deleteFile/:file/:project', contSession.authrequired, controller.deleteFile);

    //get local stl file
    app.get('/getLocalFile/:file', contSession.authrequired, controller.getLocalSTLFile);

    // create a user
    app.post('/createUser', controller.createUser);

    // get create user html page
    app.get('/CreateUser.html', controller.createUserPage);

    // get ticket DCME
    app.get('/getTicket', contSession.authrequired, controller.getTicket); 

    // get dcme folder id
    app.get('/getDCMEId/:feature', contSession.authrequired, controller.getDCMEId);

    // get project dcme folder id
    app.get('/getProjectDCMEId/:project', contSession.authrequired, controller.getProjectDCMEId); 

    //get project id
    app.get('/getprojectid/:feature', contSession.authrequired, controller.getprojectid);

    // get user company with id
    app.get('/getUserCompany', contSession.authrequired, controller.getCompanies);

    // get user company with id
    app.get('/getUserCompany/:customerId', contSession.authrequired, controller.getUserInformation);

    // set node of a file
    app.post('/fileNodeRef/:fileName', contSession.authrequired, controller.fileNodeRef);

    //update User informations
    app.post('/updateUser', contSession.authrequired, controller.updateUser);

    // update feature for a file
    app.put('/updateFileFeature/:feature', contSession.authrequired, controller.updateFileFeature);

    //get adress id for a file
    app.get('/getFileId/:file/:feature', contSession.authrequired, controller.getFileId);

    // get file id with a project name
    app.get('/getFileIdProject/:file/:project', contSession.authrequired, controller.getFileIdProject)

    // set file feature after feature creation
    app.put('/setFileFeature/:feature', contSession.authrequired, controller.setFileFeature);

    // get all users
    app.get('/getUserDetails', contSession.authrequired, controller.getUserDetails);

    // update customer role
    app.put('/updateCustomerRole', contSession.authrequired, controller.updateCustomerRole);

    // set document node for DCME
    app.post('/postDCMEId/:project', contSession.authrequired, controller.postDCMEId);
}