var db = require('../../../app/lib/sadda-db');
var db_tables = db.tables;
var Log = require('./../../../app/lib/log');
var error_messages = require("./../../../app/config/error_messages");
var moment = require("moment");
var async  = require("async");

//Count and return the no of users
var getUserCount = function(callback){
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
exports.getUserCount = getUserCount;

//get user previous seven days data
var getDay = function(){
    var response = {};
    response.success = true;
    response.data = [];
    var query = function(date,next){
        var query = "SELECT COUNT(*) as userCount from " + db_tables.users.name+" WHERE created_at <= '"+date+"'";
        db.get().query(query, function(err, result){
            if (err) {
                Log.e(err.toString());
                next(new Error(error_messages.UNKNOWN_ERROR));
            }else {
                response.data.push(result[0].userCount);
            }
            var new_date = moment(date).subtract(1,'day').format('YYYY-MM-DD hh:mm:ss').toString();
            next(null , new_date);
        });
    }
    this.data = function(next){
        async.waterfall([
            async.apply(query , moment().format('YYYY-MM-DD hh:mm:ss')),
            query,
            query,
            query,
            query,
            query,
            query
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
        );
    }
}
exports.getDay = getDay;

//User registered previous seven weeks
var getWeek = function(){
    var response = {};
    response.success = true;
    response.data = [];
    var query = function(date,next){
        var query = "SELECT COUNT(*) as userCount from " + db_tables.users.name+" WHERE created_at <= '"+date+"'";
        db.get().query(query, function(err, result){
            if (err) {
                Log.e(err.toString());
                next(new Error(error_messages.UNKNOWN_ERROR));
            }else {
                response.data.push(result[0].userCount);
            }
            var new_date = moment(date).subtract(7,'day').format('YYYY-MM-DD hh:mm:ss').toString();
            next(null , new_date);
        });
    }
    this.data = function(next){
        async.waterfall([
            async.apply(query , moment().add(1,'day').format('YYYY-MM-DD hh:mm:ss')),
            query,
            query,
            query,
            query,
            query,
            query
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
        );
    }
}
exports.getWeek = getWeek;
 
//User registered previous seven month
var getMonth = function(){
    var response = {};
    response.success = true;
    response.data = [];
    var query = function(date,next){
        var query = "SELECT COUNT(*) as userCount from " + db_tables.users.name+" WHERE created_at <= '"+date+"'";
        db.get().query(query, function(err, result){
            if (err) {
                Log.e(err.toString());
                next(new Error(error_messages.UNKNOWN_ERROR));
            }else {
                response.data.push(result[0].userCount);
            }
            var new_date = moment(date).subtract(30,'day').format('YYYY-MM-DD hh:mm:ss').toString();
            next(null , new_date);
        });
    }
    this.data = function(next){
        async.waterfall([
            async.apply(query , moment().add(1,'day').format('YYYY-MM-DD hh:mm:ss')),
            query,
            query,
            query,
            query,
            query,
            query
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
        );
    }
}
exports.getMonth = getMonth;

//Get user registered with the given dates
exports.custom = function(args , callback){
    var response = {};
    response.success = true;
    if(!args.start_date || !args.end_date) {
        response.success = false;
        response.message = error_messages.MISSING_PARAMETERS;
        callback(null , response);
    }else {
        var start_date = args.start_date;
        var end_date = moment(args.end_date).add(1,'day').format('YYYY-MM-DD').toString();
        var query = "SELECT COUNT(*) as userCount from "+db_tables.users.name+" WHERE created_at BETWEEN '"+start_date+"' AND '"+end_date+"'";
        db.get().query(query, function(err,result){
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
}

//get user All the four function excluding the custom one
exports.getAll = function(next){
    async.series({
        totatUser:getUserCount,
        previousDay : new getDay().data,
        previousWeek:new getWeek().data,
        previousMOnth:new getMonth().data         
    } , function(err, result){
            var res = {};
            if(err){
                res.success = false;
                res.message = err;
                next(null , res);
            }else{
                res.success = true;
                res.result = result;
                next(null , res);
            }
        }
    );
}
  
