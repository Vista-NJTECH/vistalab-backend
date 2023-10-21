module.exports.groupBy = function(data, groupByKey) {
    const groups = {};
  
    data.forEach((item) => {
      const key = item[groupByKey];
  
      if (!groups[key]) {
        groups[key] = [];
      }
  
      groups[key].push(item);
    });
  
    return groups;
}