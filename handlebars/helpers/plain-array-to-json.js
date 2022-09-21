function plainArrayToJson(context, objKey, key, options) {
  const result = (context || []).reduce((acc, curr) => {
    acc[curr?.[objKey]] = curr?.[key];
    return acc;
  }, {});
  return options.fn(result);
}

module.exports = plainArrayToJson;
