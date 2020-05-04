// For more info, check https://www.netlify.com/docs/functions/#javascript-lambda-functions
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})
module.exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  console.log(`${event.headers.host}${event.path}`);
  let data = context.clientContext.custom.netlify;
  let decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

  return {
    // return null to show no errors
    statusCode: 200, // http status code
    body: decoded
  };
}

// Now you are ready to access this API from anywhere in your Gatsby app! For example, in any event handler or lifecycle method, insert:
// fetch("/.netlify/functions/hello")
//    .then(response => response.json())
//    .then(console.log)
// For more info see: https://www.gatsbyjs.org/blog/2018-12-17-turning-the-static-dynamic/#static-dynamic-is-a-spectrum
