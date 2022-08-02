const getDaysInYear = year => {
  return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
};

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(+d);
  d.setHours(0, 0, 0, 0);
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  // Get first day of year
  var yearStart = new Date(d.getFullYear(), 0, 1);
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return [d.getFullYear(), weekNo];
}

function weeksInYear(year) {
  var month = 11,
    day = 31,
    week;

  // Find week that 31 Dec is in. If is first week, reduce date until
  // get previous week.
  do {
    d = new Date(year, month, day--);
    week = getWeekNumber(d)[1];
  } while (week == 1);

  return week;
}

const padAggregateArr = (arr, secondProp, type) => {
  const paddedArr = [];

  arr.forEach((el, i) => {
    if (!paddedArr.length) return paddedArr.push(el);

    const prevEl = arr[i - 1];
    if (el._id === prevEl._id + 1) return paddedArr.push(el);

    let safetyCheck = 0;
    while (!(el._id === paddedArr[paddedArr.length - 1]._id + 1)) {
      const lastPushed = paddedArr[paddedArr.length - 1];

      paddedArr.push({
        _id: lastPushed._id + 1,
        [secondProp]: 0,
        year: lastPushed.year,
      });

      const startNewYear = () => {
        paddedArr.push({
          _id: 1,
          [secondProp]: 0,
          year: lastPushed.year + 1,
        });
      };

      if (type === 'month' && lastPushed._id === 12) {
        if (arr[i + 1]._id === 1) {
          break;
        } else startNewYear();
      }

      if (type === 'week' && lastPushed._id === weeksInYear(lastPushed.year)) {
        if (arr[i + 1]._id === 1) {
          break;
        } else startNewYear();
      }

      if (type === 'day' && lastPushed._id === getDaysInYear(lastPushed.year)) {
        if (arr[i + 1]._id === 1) {
          break;
        } else startNewYear();
      }

      if (safetyCheck > 9999) {
        console.log('break WHILE loop!');
        break;
      }
      safetyCheck++;
    }
    paddedArr.push(el);
  });

  return paddedArr;
};

exports.formatAggregateArr = function (arr, secondProp, type) {
  const paddedArr = padAggregateArr(arr, secondProp, type);

  return paddedArr.map(el => {
    let date;

    if (type === 'month')
      date = new Date(el.year, el._id - 1, 1).toLocaleDateString('en-US', {
        month: 'short',
      });

    if (type === 'week')
      date = new Date(el.year, 0, 2 + (el._id - 1) * 7).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

    if (type === 'day') {
      date = new Date(el.year, 0, el._id).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }

    return { name: date, [secondProp]: el[secondProp], year: el.year };
  });
};
