"use strict";

const chromeLambda = require("@sparticuz/chrome-aws-lambda");

module.exports.generate = async (event) => {
  const { body } = event;

  const { rawHtml } = JSON.parse(body);
  const htmlContent = rawHtml.toString("utf-8");
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
