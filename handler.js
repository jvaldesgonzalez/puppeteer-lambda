"use strict";

const chromeLambda = require("@sparticuz/chrome-aws-lambda");

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Testing serverless framework",
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.generate = async (event) => {
  const { queryStringParameters } = event;
  if (
    !queryStringParameters ||
    !queryStringParameters.url ||
    !queryStringParameters.screen
  ) {
    return { statusCode: 403 };
  }
  const { url } = queryStringParameters;
  const [width, height] = queryStringParameters.screen.split(",");

  if (!width || !height) {
    return { statusCode: 403 };
  }

  const browser = await chromeLambda.puppeteer.launch({
    args: chromeLambda.args,
    defaultViewport: chromeLambda.defaultViewport,
    executablePath: await chromeLambda.executablePath,
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: Number(width),
    height: Number(height),
  });

  await page.goto(url);
  const screenshot = await page.screenshot({ encoding: "base64" });

  return {
    statusCode: 200,
    body: `<img src="data:image/png;base64,${screenshot}">`,
    headers: { "Content-Type": "text/html" },
  };
};
