var moment = require('moment');

var CheckTiming  = function (timing) {
    var timeArray = timing.split(",");
    var currentTime = moment().format('HH:mm').toString();
    var dayCount = moment().day()
    dayCount = parseInt(dayCount);
    var timingDay = timeArray[dayCount].split(" ");
    var open = false;
    var nextOpen = "";
    timingDay.forEach(element => {
        var particularTime  = element.split("-");
        if(currentTime>=particularTime[0] && currentTime < particularTime[1])
        {
            open = true;
        } 
        else if(currentTime < particularTime[0] && currentTime < particularTime[1] && nextOpen == "" && !open){
            nextOpen = particularTime[0]
        }
    });
    var result = {
        open : open,
        nextOpen : nextOpen
    }
    return result;
}

module.exports = CheckTiming;