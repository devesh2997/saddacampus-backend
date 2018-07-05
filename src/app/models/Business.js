var Merchant = require('./Merchant');
var db = require('../lib/sadda-db');
var db_tables = db.tables;
var error_messages = require('../config/error_messages');
var db_utils = require('../lib/db-utils');
var Log = require('../lib/log');
var validator = require('../utility/validator');
var QueryBuilder = require('../lib/db-utils').QueryBuilder;


//status constants for business model
var statusConstants = {}
statusConstants.active = 'active';
statusConstants.disabled = 'disabled';

exports.status = statusConstants;

//type constants for merchant model
var typeConstants = {}
typeConstants.restaurant = 'restaurant';

exports.types = typeConstants;

/**
 * function to check if merchant with given merchant_id exists or not
 * @param {Object} args
 * @param {String} args.merchant_id
 */
var merchantExists = function(args, callback){
	Merchant.findByMerchantId(args, function(err, res){
		if(err)
			callback(err);
		else{
			if(res.Merchant)
				callback(null,true);
			else
				callback(null,false);
		}
	});
}


/**
 * Validates merchant_id, business_id, name, address, type and gstin
 * @param {Object} args
 * @param {String} args.merchant_id
 * @param {String} args.business_id
 * @param {String} args.name
 * @param {String} args.address
 * @param {String} args.type
 * @param {String} args.gstin
 */
var validateArgs = function(args, callback){
	//check if all the required parameters are provided or not
	if(!args.merchant_id || !args.business_id || !args.name || !args.type || !args.address)
		return callback(new Error(error_messages.MISSING_PARAMETERS));
	//validate business_id - length should be 3
	if(!validator.businessIdIsValid(args.business_id))
		return callback(new Error(error_messages.INVALID_BUSINESS_ID));

	//validate type
	if(args.type !== typeConstants.restaurant)
		return callback(new Error(error_messages.INVALID_BUSINESS_TYPE));

	//validate merchant_id - check if merchant if with the given merchant_id exists or not
	merchantExists(args, function(err, exists){
		if(err)
			return callback(err);
		else if(!exists)
			return callback(new Error(error_messages.MERCHANT_DOES_NOT_EXIST));
		else{
			//check if duplicate business with same business_id exists or not
			findById(args, function(err, result){
				if(err)
					return callback(err);
				if(result.Business)
					return callback(null, true);
				return callback(null, false);
			});
		}
	});
}

/**
 * Create a new business
 * @param {Object} args
 * @param {String} args.merchant_id
 * @param {String} args.business_id
 * @param {String} args.name
 * @param {String} args.address
 * @param {String} args.type
 * @param {String} args.gstin
 */
exports.create = function(args, callback){
	validateArgs(args,function(err, exists){
		if(err)
			return callback(err);
		else{
			if(exists)
				return callback(new Error(error_messages.DUPLICATE_BUSINESS));
			args.table_name = db_tables.businesses.name;
			args.fields = db_tables.businesses.fields;
			args.values = [args.merchant_id, args.business_id, args.name, args.address, args.type,args.gstin || '', statusConstants.disabled];
			var query = db_utils.query_creator.insert(args);
			db.get().query(query, args.values, function(err){
				if (err){
					Log.e(err.toString());
					callback(new Error(error_messages.UNKNOWN_ERROR));
				}else{
					findById(args, function(err, res){
						if(err){
							Log.e(err.toString());
							callback(new Error(error_messages.UNKNOWN_ERROR));
						}else{
							callback(null, res);
						}
					});
				}

			});
		}
	});
}


/**
 * find business by merchant_id and business_id
 * @param {Object} args
 * @param {String} args.merchant_id
 * @param {String} args.business_id
 */
var findById = function(args, callback){
	if(!args.merchant_id || !args.business_id)
		return callback(new Error(error_messages.MISSING_PARAMETERS));
	else if(!validator.businessIdIsValid(args.business_id))
		return callback(new Error(error_messages.INVALID_BUSINESS_ID));
	else{
		var query = "SELECT * FROM "+db_tables.businesses.name+" WHERE (merchant_id = '"+args.merchant_id+"' AND business_id = '"+args.business_id+"')";
        db.get().query(query, function(err,result){
            if(err){
                Log.e(err);
                callback(new Error(error_messages.UNKNOWN_ERROR));
            }else{
                callback(null, {
                    Business: result[0]
                });
            }
        });
	}
}
exports.findById = findById;

/**
 * Change business status to active
 * returns Business{merchant_id,business_id,name, address,type, gstin, status} Object
 * @param {Object} args
 * @param {String} args.merchant_id
 * @param {String} args.business_id
 */
exports.enable = function(args, callback){
	if(!args.merchant_id || !args.business_id){
		callback(new Error(error_messages.MISSING_PARAMETERS));
	}else{
		var query = "UPDATE "+db.tables.businesses.name+" SET status='"+statusConstants.active+"' WHERE (merchant_id='"+args.merchant_id+"' AND business_id='"+args.business_id+"')";
		db.get().query(query, function(err, result){
            if(err){
                Log.e(err);
                callback(new Error(error_messages.UNKNOWN_ERROR));
            }else{
				if(result.affectedRows === 1){
					findById(args,function(err, res){
						if(err)
							callback(err);
						else
							callback(null,res);
					});
				}else{
					callback(new Error(error_messages.MERCHANT_DOES_NOT_EXIST));
				}
            }
        });
	}
}

/**
 * Change business status to disable
 * returns Business{merchant_id,business_id,name, address,type, gstin, status} Object
 * @param {Object} args
 * @param {String} args.merchant_id
 * @param {String} args.business_id
 */
exports.disable = function(args, callback){
	if(!args.merchant_id || !args.business_id){
		callback(new Error(error_messages.MISSING_PARAMETERS));
	}else{
		var query = "UPDATE "+db.tables.businesses.name+" SET status='"+statusConstants.disabled+"' WHERE (merchant_id='"+args.merchant_id+"' AND business_id='"+args.business_id+"')";
		db.get().query(query, function(err, result){
            if(err){
                Log.e(err);
                callback(new Error(error_messages.UNKNOWN_ERROR));
            }else{
				if(result.affectedRows === 1){
					findById(args,function(err, res){
						if(err)
							callback(err);
						else
							callback(null,res);
					});
				}else{
					callback(new Error(error_messages.MERCHANT_DOES_NOT_EXIST));
				}
            }
        });
	}
}

/**
 * delete business
 * @param {Object} args
 * @param {String} args.merchant_id
 * @param {String} args.business_id
 */
exports.delete = function(args,callback){
	if(!args.merchant_id || !args.business_id){
		return callback(new Error(error_messages.MISSING_PARAMETERS));
	}
	if(!validator.businessIdIsValid(args.business_id)){
		return callback(new Error(error_messages.INVALID_BUSINESS_ID));
	}
	findById(args, function(err, result){
		if(err)
			callback(err);
		else{
			if(!result.Business){
				return callback(new Error(error_messages.BUSINESS_DOES_NOT_EXIST));
			}else{
				var query = "DELETE FROM "+db_tables.businesses.name+" WHERE (merchant_id='"+args.merchant_id+"' AND business_id='"+args.business_id+"')";
				db.get().query(query,function(err, result){
					if(err){
						Log.e(err);
						return callback(new Error(error_messages.UNKNOWN_ERROR));
					}else{
						if(result.affectedRows === 0){
							return callback(new Error(error_messages.UNKNOWN_ERROR));
						}
						callback(null);
					}
				});
			}
		}
	});
}

/**
 * find all businesses owned by a particular merchant
 * @param {Object} args
 * @param {String} args.merchant_id
 */
exports.getAllByMerchantId = function(args, callback){
	if(!args.merchant_id)
		return callback(new Error(error_messages.MISSING_PARAMETERS));
	else{
		Merchant.findByMerchantId(args,function(err, res){
			if(err){
				Log.e(err);
				return callback(new Error(error_messages.UNKNOWN_ERROR));
			}
			if(!res.Merchant)
				return callback(new Error(error_messages.MERCHANT_DOES_NOT_EXIST));
				var query = "SELECT * FROM "+db_tables.businesses.name+" WHERE merchant_id = '"+args.merchant_id+"'";
				db.get().query(query, function(err,result){
					if(err){
						Log.e(err);
						callback(new Error(error_messages.UNKNOWN_ERROR));
					}else{
						callback(null, {
							Businesses: result
						});
					}
				});
		});
	}
}

/**
 * Update business info
 * All the info(except status) must be provided irrespective of whether they are being changed or not
 * @param {Object} args
 * @param {String} args.merchant_id
 * @param {String} args.business_id
 * @param {String} args.new_business_id
 * @param {String} args.name
 * @param {String} args.address
 * @param {String} args.type
 * @param {String} args.gstin
 */
exports.update = function(args, callback){
	validateArgs(args,function(err, exists){
		if(err)
			return callback(err);
		else{
			if(!exists){
				return callback(new Error(error_messages.BUSINESS_DOES_NOT_EXIST));
			}
			var query = QueryBuilder.update(db_tables.businesses.name).set({
				business_id:args.new_business_id,
				name: args.name,
				address: args.address,
				type: args.type,
				gstin: args.gstin
			}).whereAllEqual({merchant_id: args.merchant_id,business_id: args.business_id}).build();
			db.get().query(query, function(err, result){
				if(err){
					Log.e(err);
					return callback(err);
				}else{
					if(result.affectedRows === 1){
						args.business_id = args.new_business_id;
						findById(args,function(err, res){
							if(err)
								callback(err);
							else
								callback(null,res);
						});
					}else{
						callback(new Error(error_messages.MERCHANT_DOES_NOT_EXIST));
					}
				}
			});
		}
	});
}

