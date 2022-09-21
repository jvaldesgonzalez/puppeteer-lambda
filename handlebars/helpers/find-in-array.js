function findInArray(context, objKey, key, options) {
  const type = context.find((item) => item[objKey] === key);
  return options.fn(type);
}

module.exports = findInArray;
