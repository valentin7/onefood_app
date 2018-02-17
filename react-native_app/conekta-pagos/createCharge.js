var conekta = require('conekta');
conekta.api_key = 'key_SMvGrq2XQRoAeSbMx5WdKw';
conekta.locale = 'es';

module.exports.handler = (event, context, callback) => {
  // const requestBody = JSON.parse(event.body);
  // const token = requestBody.token.id;
  // const amount = requestBody.charge.amount;
  // const currency = requestBody.charge.currency;
  console.log("creating charge");
  
  return conekta.Order.create({
      "currency": "MXN",
      "customer_info": {
          "name": "Charls Crypto",
          "phone": "+5215555555555",
          "email": "jul@conekta.io"
      },
      "line_items": [{
          "name": "Box of Cohiba S1s",
          "description": "Imported From Mex.",
          "unit_price": 35000,
          "quantity": 1,
          "tags": ["food", "mexican food"],
          "type": "physical"
      }]
    }, function(err, res) {
      if (err) {
          console.log(err.type);
          const response = {
             statusCode: 500,
             headers: {
               'Access-Control-Allow-Origin': '*',
             },
             body: JSON.stringify({
               error: err.message,
             }),
           };
           callback(null, response);
          return;
      }
      // successfully made the charge
      var charge = res.toObject();
      //printOrderInfo(charge);
      
      const response = {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: `Charge processed succesfully!`,
            charge,
          }),
        };
      callback(null, response);
      
      console.log(res.toObject());
  })
  // .then((charge) => { // Success response
  //   printOrderInfo(charge);
  //   const response = {
  //     statusCode: 200,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //     },
  //     body: JSON.stringify({
  //       message: `Charge processed succesfully!`,
  //       charge,
  //     }),
  //   };
  //   callback(null, response);
  // })
  // .catch((err) => { // Error response
  //   const response = {
  //     statusCode: 500,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //     },
  //     body: JSON.stringify({
  //       error: err.message,
  //     }),
  //   };
  //   callback(null, response);
  // })
};


function printOrderInfo(order) {
  console.log("PRINTING ORDER INFO");
  console.log("ID: " + order.id);
  console.log("Status: " + order.payment_status);
  console.log("$" + (order.amount/100) + order.currency);
  console.log("Order");
  console.log(order.line_items[0].quantity + " - "
              + order.line_items[0].name + " - "
              + (order.line_items[0].unit_price/100));
  console.log("Payment info");
  console.log("Code: " + order.charges[0].payment_method.auth_code);
  console.log("Card info: "
                + order.charges[0].payment_method.name + " - "
                + "<strong><strong>" + order.charges[0].payment_method.last4 + " - "
                + order.charges[0].payment_method.brand + " - "
                + order.charges[0].payment_method.type);
}