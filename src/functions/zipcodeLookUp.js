require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

const axios = require("axios");

module.exports.handler = async function(event, context, callback) {
  const promise = new Promise(function(resolve, reject) {
    // Only allow GET
    if (event.httpMethod !== "GET") {
      resolve(405) //Method Not Allowed
    }

    const zipcode = event.queryStringParameters.zip;

    axios({
      "method":"GET",
      "url":`https://redline-redline-zipcode.p.rapidapi.com/rest/multi-info.json/${zipcode}/degrees`,
      "headers":{
      "content-type":"application/octet-stream",
      "x-rapidapi-host":"redline-redline-zipcode.p.rapidapi.com",
      "x-rapidapi-key":process.env.X_RAPIDAPI_KEY
      }
      })
      .then((response) => resolve({
          statusCode: 200, // http status code
          headers: { "content-type": "application/json" },
          body: JSON.stringify(response.data)
        })
      )
      .catch((error) => resolve({
        statusCode: 400,
        body: error.toJSON()
      }))
  })

  return promise
}

// Now you are ready to access this API from anywhere in your Gatsby app! For example, in any event handler or lifecycle method, insert:
// fetch("/.netlify/functions/hello")
//    .then(response => response.json())
//    .then(console.log)
// For more info see: https://www.gatsbyjs.org/blog/2018-12-17-turning-the-static-dynamic/#static-dynamic-is-a-spectrum
