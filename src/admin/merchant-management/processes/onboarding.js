var Merchant = require('../../../app/models/_Merchants');

/**
 * creating a new merchant
 * @param {Object} args
 * @param {String} args.name
 * @param {String} args.email
 * @param {String} args.password
 * @param {String} args.country_code
 * @param {String} args.number
 * @param {String} args.alternate_country_code
 * @param {String} args.alternate_number
 */
var Onboarding = function(args){
	this.createMerchant = function(callback){
		Merchant.addMerchant(args, function(err, result){
			var response = {};
            if(err){
                response.success = false;
                response.message = err.message;
            }
            else{
                response.success = true;
                response.Merchant = result.Merchant;
            }
            callback(null, response);
		});
	}
}

module.exports = Onboarding;
