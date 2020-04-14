// For more info, check https://www.netlify.com/docs/functions/#javascript-lambda-functions
module.exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  return {
    // return null to show no errors
    statusCode: 200, // http status code
    body: JSON.stringify({publicKey: 'pk_test_R9IeJiPwsi6pVsJR1RXjsF0B00AWKROF7L'})
  }
}

// Now you are ready to access this API from anywhere in your Gatsby app! For example, in any event handler or lifecycle method, insert:
// fetch("/.netlify/functions/hello")
//    .then(response => response.json())
//    .then(console.log)
// For more info see: https://www.gatsbyjs.org/blog/2018-12-17-turning-the-static-dynamic/#static-dynamic-is-a-spectrum
