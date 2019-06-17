// Specific ODBC API
let userPrompts = require("../../userPrompts");

var con;


switch (userPrompts.dbType) {
  case "mysql": {
    let mysql = require('mysql');
    if (con == undefined){
      con = mysql.createConnection({
        host: userPrompts.host,
        user: userPrompts.user,
        password: userPrompts.password,
        database: userPrompts.databaseSchema
      });
      console.log("Mysql Connected!");
    }
  }break;
  case "postgreSql": {
    let {Pool, Client} = require('pg');
    if (con == undefined){
      con = new Client({
        user: userPrompts.user,
        host: userPrompts.host,
        database: userPrompts.databaseSchema,
        password: userPrompts.password,
        port: userPrompts.port,
      });
      con.connect();
      console.log("PostgresSQL Connected!");
    }
  }break;
  case "oracle": {
    let oracledb = require('oracledb');
    if (con == undefined){
      con = oracledb.getConnection(
        {
          user          : userPrompts.user,
          password      : userPrompts.password,
          connectString : userPrompts.host
        },
        function(err, connection) {
          if (err) {
            console.error(err.message);
            return;
          }  
      });
      console.log("PostgresSQL Connected!");
    }
  }break;
  case "db2": {
    
    var ibmdb = require('ibm_db');
    if (con == undefined){
      db2Url = "DATABASE="+userPrompts.databaseSchema+";HOSTNAME="+userPrompts.host+";UID="+userPrompts.user+";PWD="+userPrompts.password+";PORT="+ userPrompts.port+";PROTOCOL=TCPIP";
      con = ibmdb.open(db2Url, function (err,conn) {
        if (err) return console.log(err);
      });    
      console.log("IBM DB2 Connected!");  
    }  
  }break;

  default:
    break;
}

module.exports = function(odbcModel) {

/**
 * getRequestdb
 * @param {string} request SQL Request
 * @callback {Function} callback Callback function
 * @param {Error|string} err Error object
 * @param {any} result Result object
 */
odbcModel.getRequestdb = function(request, callback) {

  // Replace the code below with your implementation.
  // Please make sure the callback is invoked.
  con.query(request, function (err, result, moreResultSets) {
      if (err) 
      {
        console.log(err);
        result = err;
      }
      callback(null, result);
    });
}


/**
 * get DB Schema

 * @callback {Function} callback Callback function
 * @param {Error|string} err Error object
 * @param {any} result Result object
 */
odbcModel.getDbSchema = function(callback) {

  // Replace the code below with your implementation.
  // Please make sure the callback is invoked.
  switch (userPrompts.dbType) {
    case "mysql": {
    var sql = "SHOW TABLES;"
    }break;
    case "postgreSql": {
      var sql = "SELECT * FROM pg_catalog.pg_tables;"
    }break;
  }
  con.query(sql, function (err, result, moreResultSets) {
      if (err) 
      {
        console.log(err);
        result = err;
      }
      callback(null,result);
    });
}


odbcModel.remoteMethod('getRequestdb',
  { isStatic: true,
  produces: [ 'application/json' ],
  accepts: 
   [ { arg: 'request',
       type: 'string',
       description: 'SQL Request',
       required: true,
       http: { source: 'query' } } ],
  returns: {arg: 'request', type: 'string'},
  http: { verb: 'get', path: '/requestdb' },
  description: undefined }
);

odbcModel.remoteMethod('getDbSchema',
  { isStatic: true,
  accepts: [],
  returns: {arg: 'schema', type: 'string'},
  http: { verb: 'get', path: '/dbSchema' },
  description: 'get DB Schema' }
);

}

// TODO: the developer will write here the private methods necessary for the connector