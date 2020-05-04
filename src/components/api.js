const createPaymentIntent = async options => {
  return window
    .fetch(`/.netlify/functions/createPayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(options)
    })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw new Error("PaymentIntent API Error");
      } else {
        let amt = data.amount.toString();
        let len = amt.length;
        let decimal = amt.substring(len-2, len);
        let dollars = amt.substring(0, len-2);
        return  {
          clientSecret: data.client_secret,
          amount: data.grandTotal,
          lineItems: data.lineItems
        }
      }
    });
};


const getPublicStripeKey = async options => {
  return window
    .fetch(`/.netlify/functions/publicKey`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw Error("API Error");
      } else {
        return data.publicKey;
      }
    });
};

const saveOrder = async options => {
  return window
    .fetch(`/.netlify/functions/saveOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(options)
    })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw new Error("SaveOrder API Error");
      }
    });
};

const api = {
  createPaymentIntent,
  getPublicStripeKey: getPublicStripeKey,
  saveOrder: saveOrder
};

export default api;