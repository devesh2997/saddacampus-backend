var User = require('./../../../app/models/User_info');
var error_message = require('./../../../app/config/error_messages');
var InstituteBusiness = require('./../../../app/models/Institute/Institute_has_business');
var Restaurant = require('./../../../app/models/Restraunt_info');
var Business = require('./../../../app/models/_Business');
var async = require('async');

var UserData = function(args){
    var flag = false;
    this.getUserInfo = function(next){
        User.findUser(args,function(err,result){
            if(err) return next(err);
            if(result.length == 0 || !result[0].code){
                flag = true;
                return next(new Error(error_message.USER_DATA_DONT_EXIST));
            }
            next(null,result[0]);
        });
    }
    this.getUserBusiness = function(data,next){
        InstituteBusiness.findInstitute({code:data.code},function(err,result){
            if(err) return next(err);
            return next(null,result,data);
        });
    }
    this.getRestaurant = function(data,user_data,next){
        var res = [];
        var count = 0;
        data.forEach(function(element){
            Business.findBusiness({merchant_id:element.merchant_id , business_id:element.business_id},function(err,result){
                if(err) return next(err);
                if(result[0].status == "active" && result[0].type == "restaurant")
                    res.push(result[0]);
                count++;
                if(count == data.length) next(null,res,user_data);
            });
        })
    }
    this.getRestaurantDetails = function(data,user_data,next){
        var response = {
            user_data : user_data
        };
        var res = [];
        var count = 0;
        if(data.length == 0) next(null,[]);
        data.forEach(function(element){
            var value = {
                merchant_id : element.merchant_id,
                business_id : element.business_id
            }
            Restaurant.findRestaurant(value,function(err,result){
                if(err) return next(err);
                result[0]['name'] = element.name;
                result[0]['address'] = element.address;
                result[0]['gstin'] = element.gstin;
                result[0]['open'] = true;
                if(result[0].super_status == 'closed') result[0].open = false;
                res.push(result[0]);
                count++;
                if(count == data.length){
                    response['restaurant_data'] = res;
                    next(null,response);
                }
            });
        });
    }
    this.getAll = function(callback){
        async.waterfall([
            this.getUserInfo,
            this.getUserBusiness,
            this.getRestaurant,
            this.getRestaurantDetails
        ],function(err,result){
            var res = {};
            if(err){
                if(flag){
                    res.success = true;
                    res.user_data_exist = false;
                } else {
                    res.success = false;
                    res.error = err.message;
                }
            } else {
                res.success = true;
                res.user_data_exist = true;
                res.result = result;
            }
            callback(res);
        });
    }
}

module.exports = UserData;