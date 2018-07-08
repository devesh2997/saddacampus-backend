var db = require('../../../app/lib/sadda-db');
var db_tables = db.tables;
var Log = require('./../../../app/lib/log');
var error_messages = require("./../../../app/config/error_messages");
var moment = require("moment");
var async  = require("async");

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
        callback(null , response);
    });
}
  
//User registered previous six weeks
exports.getWeek = function(){
    var response = {};
    response.success = true;
    response.result = {
        data:[]
    };
    this.query = function(date,next){
        var query = "SELECT COUNT(*) as userCount from " + db_tables.users.name+" WHERE created_at <= '"+date+"'";
        db.get().query(query, function(err, result){
            if (err) {
                Log.e(err.toString());
                next(new Error(error_messages.UNKNOWN_ERROR));
            }else {
                response.result.data.push(result[0].userCount);
            }
            var new_date = moment(date).subtract(7,'day').format('YYYY-MM-DD').toString();
            next(null , new_date);
        });
    }
    this.data = function(next){
        async.waterfall([
            async.apply(this.query , moment().add(1,'day').format('YYYY-MM-DD')),
            this.query,
            this.query,
            this.query,
            this.query,
            this.query,
            this.query
        ] , function(error){
                if(error)
                {
                    next(null , {
                        success:false,
                        message : error_messages.UNKNOWN_ERROR
                    });
                }
                next(null , response);
            }
        )
    }
}
 
//User registered previous six month
exports.getMonth = function(){
    var response = {};
    response.success = true;
    response.result = {
        data:[]
    };
    this.query = function(date,next){
        var query = "SELECT COUNT(*) as userCount from " + db_tables.users.name+" WHERE created_at <= '"+date+"'";
        db.get().query(query, function(err, result){
            if (err) {
                Log.e(err.toString());
                next(new Error(error_messages.UNKNOWN_ERROR));
            }else {
                response.result.data.push(result[0].userCount);
            }
            var new_date = moment(date).subtract(30,'day').format('YYYY-MM-DD').toString();
            next(null , new_date);
        });
    }
    this.data = function(next){
        async.waterfall([
            async.apply(this.query , moment().add(1,'day').format('YYYY-MM-DD')),
            this.query,
            this.query,
            this.query,
            this.query,
            this.query,
            this.query
        ] , function(error){
                if(error)
                {
                    next(null , {
                        success:false,
                        message : error_messages.UNKNOWN_ERROR
                    });
                }
                next(null , response);
            }
        )
    }
}

//Get user registered with the given dates
exports.custom = function(args , callback){
    if(args.start_date != null && args.end_date != null)
    {
        var start_date = args.start_date;
        var end_date = moment(args.end_date).add(1,'day').format('YYYY-MM-DD').toString();
        var query = "SELECT COUNT(*) as userCount from "+db_tables.users.name+" WHERE created_at BETWEEN '"+start_date+"' AND '"+end_date+"'";
        var response = {};
        response.success = true;
        db.get().query(query, function(err,result){
            if (err) {
                Log.e(err.toString());
                response.success = false;
                response.message = error_messages.UNKNOWN_ERROR;
            }else {
                response.totalUserCount = result[0].userCount;
            }
            callback(null , response);
        })
    }
}