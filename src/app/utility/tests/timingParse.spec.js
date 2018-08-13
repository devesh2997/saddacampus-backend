var CheckTiming = require('./../timingParse');
var assert = require('assert');
describe('Check timing',function(){
    var res = {};
    before(function(){
        var timing = "02:47-12:75 15:21-21:54,09-12 15-21,9-12 15-21,9-12 15-21,9-12 15-21,9-12 15-21,"; 
        res = CheckTiming(timing)
    })
    it("check if the restraunt is open",function(){
        assert.ok(res.open)
    })
})