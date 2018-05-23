var db = require('../sadda-db');
var db_utils = require('../db-utils');


exports.e = function(error_message,user_id){
    var query;
    var fields;
    var values;
    if(user_id){
        fields = ['user_id','time','message'];
        values = [user_id,new Date().toLocaleString(),error_message];
        query = db_utils.query_creator.insert('error_logs',fields,values);
    }else{
        fields = ['time','message'];
        values = [new Date().toLocaleString(),error_message];
        query = db_utils.query_creator.insert('error_logs',fields,values);
    }

    db.get().query(query,values,function(err,result){
        if(err){
            console.log(err);
        }
    });
}