const config = require('../config')

module.exports.GetTimeGap = async function (startDate, cycleLength, cycle, endData){
    var startDate = new Date(startDate);
    const ddl = new Date(endData)
    startDate.setTime(startDate.getTime() + cycle * cycleLength * 24 * 60 * 60 * 1000);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth()+1;
    const startDay = startDate.getDate();
    startDate.setTime(startDate.getTime() + cycleLength * 24 * 60 * 60 * 1000);
    let endYear,endMonth,endDay;
    if (startDate>ddl) {
        endYear = ddl.getFullYear();
        endMonth = ddl.getMonth()+1;
        endDay = ddl.getDate();
    } else {
        endYear = startDate.getFullYear();
        endMonth = startDate.getMonth()+1;
        endDay = startDate.getDate();
    }
    return startYear+'-'+startMonth+'-'+startDay+' - '+endYear+'-'+endMonth+'-'+endDay;
}