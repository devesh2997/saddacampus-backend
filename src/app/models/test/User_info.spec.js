var assert = require('assert');
var error_messages = require('../../config/error_messages');
var db = require('../../lib/sadda-db');
var User = require('./../../models/User');
var User_info = require('./../../models/User_info');
var moment = require('moment');
var State = require('./../../models/Institute/State');
var City = require('./../../models/Institute/City');
var Institute = require('./../../models/Institute/Institue');

describe('User Info - model', function(){
    var user_id;
    var code;
	before(function(done){
		db.connect(db.MODE_TEST, function(){
			db.drop(['user_info','states','cities','users','institutes'], function(){
				done();
			});
		});
	});
    before(function(done){
        var args = {
            country_code: '91',
            number: '7541833368',
            username: 'ananddevesh22',
            profilepic: ''
        }
        User.create(args, function(err, result){
            if(err) throw err;
            user_id = result.User.user_id;
            done();
        });
    });

    before(function(done){
        State.addState({name:'Jharkkhand'},function(err,result){
            if(err) throw err;
            City.addCity({name:'Dhadbad',state_code : result.States.state_code},function(err,result){
                if(err) throw err;
                var args = {
                    code : "IITISM",
                    name : "INDIAN INSTITUTE OF TECHNOLOGY",
                    city_code : result.City.city_code
                }
                Institute.addInstitute(args,function(err,result){
                    if(err) throw err;
                    code = result.Institutes.code;
                    done();
                })
            })
        })
    });
	describe('Adding User Info', function(){
		describe('When correct credentials is provided', function(){
			var error, result;
			before(function(done){
				User_info.addUser({
					user_name: 'akash',
					email: 'akashagarwal0403@gmail.com',
                    user_id : user_id,
                    code : code,
                    user_address : "adjwdsf",
                    user_dob : moment().format('YYYY-MM-DD')
				}, function(err, res){
					error = err;
                    result = res;
					done();
				});
			});

			it('returns with no error', function(){
				assert.ok(error == null);
			});
			it('returns User object', function(){
				assert.ok(result.User_Info !== null);
            });
            it('returns User name in User_Info object', function(){
				assert.ok(result.User_Info.user_name == 'akash');
            });
            it('returns User email in User_Info object', function(){
				assert.ok(result.User_Info.user_email == 'akashagarwal0403@gmail.com');
            });
            it('returns User_id in User_Info  object', function(){
				assert.ok(result.User_Info.user_id == user_id);
            });
            it('returns Institute code in user_Info object', function(){
				assert.ok(result.User_Info.code == code);
            });
        });
        describe('When Institute code is not provided', function(){
			var error, result;
			before(function(done){
				User_info.addUser({
					user_name: 'akash',
					email: 'akashagarwal0403@gmail.com',
                    user_id : user_id,
                    user_address : "adjwdsf",
                    user_dob : moment().format('YYYY-MM-DD')
				}, function(err, res){
					error = err;
                    result = res;
					done();
				});
			});
            it('returns with error', function(){
				assert.ok(error.message == error_messages.MISSING_PARAMETERS);
			});
			it('does not return User object', function(){
				assert.ok(result == undefined);
            });
        });
        describe('When Duplicate entry is done',function(){
            var error;
            var result;
            before(function(done){
				User_info.addUser({
					user_name: 'akash',
					email: 'akashagarwal0403@gmail.com',
                    user_id : user_id,
                    code : code,
                    user_address : "adjwdsf",
                    user_dob : moment().format('YYYY-MM-DD')
				}, function(err){
                    if(err) throw err;
                    User_info.addUser({
                        user_name: 'akash',
                        email: 'akashagarwal0403@gmail.com',
                        user_id : user_id,
                        code : code,
                        user_address : "adjwdsf",
                        user_dob : moment().format('YYYY-MM-DD')
                    }, function(err, res){
                        error = err;
                        result = res;
                        done();
                    });
                });
            });
            it("error should be returned",function(){
                assert.ok(error.message == error_messages.DUPLICATE_RESOURCE);
            })
            it("does not return result",function(){
                assert.ok(result == null);
            })
        });
    });
    describe("Finding User Info when user exists",function(){
        var error;
        var result;
        before(function(done){
            User_info.addUser({
                user_name: 'akash',
                email: 'akashagarwal0403@gmail.com',
                user_id : user_id,
                code : code,
                user_address : "adjwdsf",
                user_dob : moment().format('YYYY-MM-DD')
            }, function(err){
                if(err) throw err;
                User_info.findUser({user_id : user_id},function(err,res){
                error = err;
                result = res[0];
                done();                   
                });
            });
        });
        it("no error should be returned",function(){
            assert.ok(error == null);
        })
        it("it should return an object",function(){
            assert.ok(result != null);
        })
        it("checking name in result",function(){
            assert.ok(result.user_name == 'akash');
        })
        it("checking email in result",function(){
            assert.ok(result.user_email == 'akashagarwal0403@gmail.com');
        })
        it("checking code in result",function(){
            assert.ok(result.code == code);
        })
    })
    describe("Finding User Info when user dont exists",function(){
        var error;
        var result;
        before(function(done){
        User_info.findUser({user_id : user_id},function(err,res){
            error = err;
            result = res;
            done();                   
            });
        });
        it("no error should be returned",function(){
            assert.ok(error == null);
        })
        it("it should not return an empty array",function(){
            assert.ok(result.length == 0);
        })
    })
    describe("Updating User details when User Exits",function(){
        var error;
        var result;
        before(function(done){
            User_info.addUser({
                user_name: 'akash',
                email: 'akashagarwal0403@gmail.com',
                user_id : user_id,
                code : code,
                user_address : "adjwdsf",
                user_dob : moment().format('YYYY-MM-DD')
            }, function(err){
                if(err) throw err;
                var args_update = {
                    user_name : "Khitiz",
                    user_address : "nooo",
                    user_dob : moment().format('YYYY_MM-DD')
                }
                var args_old = {
                    user_id : user_id
                }
                User_info.updateUser({args_old : args_old , args_update : args_update},function(err,res){
                    error = err;
                    result = res[0];
                    done();
                });
            });
        });
        it("No error should be returned",function(){
            assert.ok(error == null);
        })
        it("result should not be null",function(){
            assert.ok(result != null);
        })
        it("checking name in result",function(){
            assert.ok(result.user_name == 'Khitiz');
        })
        it("checking for user_address in result",function(){
            assert.ok(result.user_address == "nooo")
        })
    })
    describe("Deleting User details when user exists",function(){
        var error;
        var result;
        before(function(done){
            User_info.addUser({
                user_name: 'akash',
                email: 'akashagarwal0403@gmail.com',
                user_id : user_id,
                code : code,
                user_address : "adjwdsf",
                user_dob : moment().format('YYYY-MM-DD')
            }, function(err){
                if(err) throw err;
                User_info.deleteUser({user_id : user_id},function(err,res){
                    error = err;
                    result = res;
                    done();
                });
            });
        });
        it("no error should be returned",function(){
            assert.ok(error == null);
        })
        it("no of affected Row should be one",function(){
            assert.ok(result.affectedRows == 1)
        })
    })
	afterEach(function(done){
		db.dropTable('user_info', function(){
			done();
		});
	});

	after(function(done){
        db.drop(['users','user_info','states','cities','institutes'], function(){
            done();
        });
	});

});
