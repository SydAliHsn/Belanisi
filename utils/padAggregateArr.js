module.exports = (arr, secondProp) => {
  const paddedArr = [];

  arr.forEach((el, i) => {
    if (!paddedArr.length) return paddedArr.push(el);

    const prevEl = arr[i - 1];

    if (el._id === prevEl['_id'] + 1) return paddedArr.push(el);

    while (!(el._id === paddedArr[paddedArr.length - 1]['_id'] + 1)) {
      paddedArr.push({ _id: paddedArr[paddedArr.length - 1]['_id'] + 1, [secondProp]: 0 });
    }
    paddedArr.push(el);
  });

  return paddedArr;
};
