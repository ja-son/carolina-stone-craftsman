// For more info, check https://www.netlify.com/docs/functions/#javascript-lambda-functions
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY, {
  maxNetworkRetries: 2
});

module.exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body);

  if(!data.details) {
    return { statusCode: 400, body: "Missing order details"}
  }

  let sqft = data.details.area / 144; // convert to sqft
  let totalEdge = data.details.edgeLength / 12; // convert to feet
  let totalBacksplash = data.details.backsplashLength / 12; // convert to feet
  let basePrice = sqft * 42; // all stone online is this price
  let edgePrice = totalEdge * 18; // $18 per linear foot
  let backsplashPrice = totalBacksplash * 12;
  let currentOption = data.details.options;
  let optionsPrice = 0;//data.details.options.reduce(function(acc, cur, index) {
//    return acc + (cur.qty * 150); // need to get options price
//  }, 0);
  let qty = parseInt(data.details.quantity);
  const oval = ["1601","1602"];
  const square = ["1628","1629"];
  const stainless = ["205","206","301","917_L", "917_R"]
  const isMatch = (el) => currentOption === el;
  if(oval.findIndex(isMatch) > 0) {
    optionsPrice = 50 * qty;
  } else if (square.findIndex(isMatch) > 0) {
    optionsPrice = 75 * qty;
  } else if(stainless.findIndex(isMatch) > 0) {
    optionsPrice = 200 * qty;
  }
  let subTotalAmount = basePrice + edgePrice + backsplashPrice + optionsPrice;
  let tax = subTotalAmount * 0.07;
  let cardProcessingFee = ((tax + subTotalAmount) * 0.029) + 0.3
  let totalAmount = subTotalAmount + tax + cardProcessingFee;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: (totalAmount * 100).toFixed(),
    currency: 'usd',
    payment_method_types: ['card'],
    description: 'Stone countertop',
    // Verify your integration in this guide by including this parameter
    metadata: {
      integration_check: 'accept_a_payment'
    },
  });

  paymentIntent.lineItems = [
    { name: "Base Price", value: basePrice },
    { name: "Edge", value: edgePrice },
    { name: "4\" Backsplash", value: backsplashPrice },
    { name: "Sink(s) & Cutout", value: optionsPrice },
    { name: "Total", value: subTotalAmount },
    { name: "Tax", value: tax },
    { name: "Handling", value: cardProcessingFee }
  ]
  paymentIntent.grandTotal = totalAmount

  return {
    // return null to show no errors
    statusCode: 200, // http status code
    body: JSON.stringify(paymentIntent)
    // body: JSON.stringify({
    //   msg: "Hello, World! This is better " + Math.round(Math.random() * 10)
    // })
  }
}

// Now you are ready to access this API from anywhere in your Gatsby app! For example, in any event handler or lifecycle method, insert:
// fetch("/.netlify/functions/hello")
//    .then(response => response.json())
//    .then(console.log)
// For more info see: https://www.gatsbyjs.org/blog/2018-12-17-turning-the-static-dynamic/#static-dynamic-is-a-spectrum
