const { SafeString } = require("handlebars");

function capitalize(context) {
  return (
    new SafeString(context.charAt(0).toUpperCase()) +
    context.toLowerCase().slice(1)
  );
}

module.exports = capitalize;
