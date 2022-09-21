"use strict";

const chromeLambda = require("@sparticuz/chrome-aws-lambda");
const hbs = require("./handlebars");
const fs = require("fs/promises");
const path = require("path");

module.exports.generate = async (event) => {
  const { body } = event;

  const { templateName, fields } = JSON.parse(body);
  const htmlContent = await compileTemplate(templateName, fields);

  const browser = await chromeLambda.puppeteer.launch({
    args: chromeLambda.args,
    defaultViewport: chromeLambda.defaultViewport,
    executablePath: await chromeLambda.executablePath,
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  await page.evaluateHandle("document.fonts.ready");
  const height = await page.evaluate(
    () => document.documentElement.offsetHeight
  );

  const pdfBuffer = await page.pdf({
    printBackground: true,
    height: `${height}px`,
    pageRanges: "1",
  });

  await browser.close();

  return {
    statusCode: 200,
    body: pdfBuffer.toString("base64"),
    isBase64Encoded: true,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  };
};

async function compileTemplate(templateName, fields) {
  const template = await readTemplate(templateName);
  const compiled = hbs.compile(template);
  return compiled(fields);
}

async function readTemplate(templateName) {
  const filepath = path.join(
    __dirname,
    "assets/templates/",
    templateName + ".hbs"
  );
  return await fs.readFile(filepath, "utf-8");
}
