const hbs = require("handlebars");
const helpers = require("./helpers");

const app = hbs.create();

app.registerHelper(helpers);

module.exports = app;
