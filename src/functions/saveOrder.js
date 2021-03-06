require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

const axios = require("axios");
const faunadb = require("faunadb");

module.exports.handler = async function(event, context, callback) {
  const promise = new Promise(function(resolve, reject) {
    // Only allow POST
    if (event.httpMethod !== "POST") {
      resolve({ statusCode: 405, body: "Method Not Allowed" })
    }

    const data = JSON.parse(event.body);

    const lineItems = {};
    const sides = {};

    data.lineItems.map( (cur, idx) => {
      lineItems[cur.name] = cur.value.toFixed(2);
    });

    data.order.sides.map( (cur, idx) => {
      let type = "edge";
      if(cur.edgeType === 4 ) type = "backsplash";
      if(cur.edgeType === 3 ) type = "edge";
      if(cur.edgeType === 2 ) type = "appliance";
      if(cur.edgeType === 1 ) type = "wall";

      sides[cur.label] = { 
        length: cur.length,
        type: type
      };
    });

    const orderItem = {
      amount: data.amount.toFixed(2),
      sides: sides,
      lineItems: lineItems,
      area: (data.order.area / 144).toFixed(2),
      backsplashLength: data.order.backsplashLength,
      edge: data.order.edge,
      edgeLength: data.order.edgeLength,
      shape: data.order.shape,
      stone: data.order.stone,
      options: data.order.options,
      sinkQuantity: data.order.quantity,
      sinkOffsets: data.order.sinkOffsets,
      metadata: data.metadata,
      iconURIData: data.order.iconURIData,
      deliveryOption: data.order.deliveryOption
    };

    const q = faunadb.query;
    const client = new faunadb.Client({
      secret: process.env.FAUNA_DB_SECRET
    });
    
    client.query(q.Select(["ref","id"], q.Create(q.Collection('orders'), { data: orderItem })))
      .then((id) => {
        orderItem.id = id;
        orderItem.iconURIData = null;
        return orderItem;
      })
      .then(order => {
        return axios({
          "method":"POST",
          "url": process.env.ZAP_GMAIL_HOOK,
          "headers":{
            "content-type":"application/json",
          },
          "data": order
        });
      })
      .then((response) => resolve({
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(orderItem)
      }))
      .catch((error) => callback(error, {
        statusCode: 400,
        body: error.message
      }));

    // axios({
    //   "method":"POST",
    //   "url": process.env.ZAP_GMAIL_HOOK,
    //   "headers":{
    //     "content-type":"application/json",
    //   },
    //   "data": orderItem
    // })
    // .then((response) => resolve({
    //   statusCode: 200,
    //   headers: { "content-type": "application/json" },
    //   // body: JSON.stringify(response.data)
    //   body: JSON.stringify(orderItem)
    // }))
    // .catch((error) => {
    //   //console.log(error);
    //   return resolve({
    //     statusCode: 400,
    //     body: error.message
    //   })
    // })
  })

  return promise
}