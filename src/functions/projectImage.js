// For more info, check https://www.netlify.com/docs/functions/#javascript-lambda-functions
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

const faunadb = require("faunadb");

module.exports.handler = async function(event, context, callback) {
  const promise = new Promise(function(resolve, reject) {
    // Only allow GET
    if (event.httpMethod !== "GET") {
      resolve(405) //"Method Not Allowed"
    }

    const id = event.queryStringParameters.id;
    const q = faunadb.query;
    const client = new faunadb.Client({
      secret: process.env.FAUNA_DB_SECRET
    });
  
    client.query(q.Get(q.Ref(q.Collection('orders'), id))
    )
    .then((ret) => {
      //console.log(ret)
      return resolve({
        // return null to show no errors
        statusCode: 200, // http status code
        body: ret.data.iconURIData.replace('data:image/png;base64,',''),
        headers: {
          "Content-Type": "image/png"
        },
        isBase64Encoded: true
      })  
    })
  })
  return promise
}

// Now you are ready to access this API from anywhere in your Gatsby app! For example, in any event handler or lifecycle method, insert:
// fetch("/.netlify/functions/hello")
//    .then(response => response.json())
//    .then(console.log)
// For more info see: https://www.gatsbyjs.org/blog/2018-12-17-turning-the-static-dynamic/#static-dynamic-is-a-spectrum
