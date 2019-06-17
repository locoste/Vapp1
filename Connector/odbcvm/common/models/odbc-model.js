
module.exports = function(odbcModel) {

/**
 * getRequestdb
 * @param {odbcModel} sqlRequest SQL Request
 * @callback {Function} callback Callback function
 * @param {Error|string} err Error object
 * @param {any} result Result object
 */
odbcModel.getRequestdb = function(sqlRequest, callback) {

  // Replace the code below with your implementation.
  // Please make sure the callback is invoked.
  process.nextTick(function() {
    var err = new Error('Not implemented');
    callback(err);
  });
  
}


/**
 * getDbSchema

 * @callback {Function} callback Callback function
 * @param {Error|string} err Error object
 * @param {any} result Result object
 */
odbcModel.getDbSchema = function(callback) {

  // Replace the code below with your implementation.
  // Please make sure the callback is invoked.
  process.nextTick(function() {
    var err = new Error('Not implemented');
    callback(err);
  });
  
}




odbcModel.remoteMethod('getRequestdb',
  { isStatic: true,
  produces: [ 'application/json' ],
  accepts:
   [ { arg: 'sqlRequest',
       type: 'odbcModel',
       description: 'SQL Request',
       required: true,
       http: { source: 'body' } } ],
  returns: [],
  http: { verb: 'get', path: '/requestdb' },
  description: undefined }
);

odbcModel.remoteMethod('getDbSchema',
  { isStatic: true,
  produces: [ 'application/json' ],
  accepts: [],
  returns: [],
  http: { verb: 'get', path: '/dbSchema' },
  description: undefined }
);

}
