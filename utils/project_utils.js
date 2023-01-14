const config = require('../config')

module.exports.GetTimeGap = async function (startDate, cycleLength, cycle){
    var startDate = new Date(startDate);
    startDate.setTime(startDate.getTime() + cycle * cycleLength * 24 * 60 * 60 * 1000);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth()+1;
    const startDay = startDate.getDate();
    startDate.setTime(startDate.getTime() + cycleLength * 24 * 60 * 60 * 1000);
    const endYear = startDate.getFullYear();
    const endMonth = startDate.getMonth()+1;
    const endDay = startDate.getDate();
    return startYear+'-'+startMonth+'-'+startDay+' - '+endYear+'-'+endMonth+'-'+endDay;
}