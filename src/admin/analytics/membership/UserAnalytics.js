var db = require('../../../app/lib/sadda-db');
var db_tables = db.tables;
var Log = require('./../../../app/lib/log');
var error_messages = require("./../../../app/config/error_messages");

    //Count and return the no of users
exports.getUserCount = function(callback){
    var query = "SELECT COUNT(*) as userCount from " + db_tables.users.name ;
    var response = {};
    response.success = true;
    db.get().query(query, function(err, result){
        if (err) {
            Log.e(err.toString());
            response.success = false;
            response.message = error_messages.UNKNOWN_ERROR;
        }else {
            response.totalUserCount = result[0].userCount;
        }
        callback(response);
    });
}


