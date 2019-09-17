let mysql = require('mysql');

con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'vapp1'
  });

exports.getRequestdb = function(request, callback) {

  // Replace the code below with your implementation.
  // Please make sure the callback is invoked.
	con.query(request, function (err, result, moreResultSets) {
      if (err) 
      {
        console.log(err);
        result = err;
      }
      callback(result);
	  });
}

