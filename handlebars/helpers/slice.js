function slice(context, options) {
  const { start, end } = options.hash;
  const result = context.slice(start, end);
  return options.fn(result);
}

module.exports = slice;
