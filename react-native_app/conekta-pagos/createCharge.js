const serverless = require("serverless-http");
const conekta = require('conekta');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require("cors");


conekta.api_key = 'key_SMvGrq2XQRoAeSbMx5WdKw';
conekta.locale = 'es';

// parse application/json
app.use(bodyParser.json());
app.use(cors());

app.get("/test", function(req, res) {
  res.send("Heyyyyyy si");
});

app.get("/", function(req, res) {
  res.send("Woahhh si");
});

app.post("/createCustomer", function(request, response) {
  //console.log("the full request is: ", request);
  console.log("the full body is ", request.body);
  const token = request.body.token;
  const name = request.body.name;
  const email = request.body.email;

  return conekta.Customer.create({
    'name': name,
    'email': email,
    'payment_sources': [{
      'type': 'card',
      'token_id': token
    }]
  }, function(err, res) {
      if(err) {
        console.log(err);
        err.status(500).json({error: err.message});
        return;
      }
      var customer = res.toObject();
      console.log("successfully created customer: ", customer);
      response.status(200).json({message: "Customer creation successful", customer});
  });
});

app.post("/createOrder", function(request, response) {
  //console.log("the full request is: ", request);
  console.log("the full body is ", request.body);
  const customerInfo = request.body.customerInfo;
  const lineItems = request.body.lineItems;
  const discountLines = request.body.discountLines;
  //const liveMode = request.body.liveMode;
  const entregaADomicilio = request.body.domicilio;
  const shippingContact = request.body.shippingContact;
  const metadata = request.body.metadata;

  var orderObject = {
    'line_items': lineItems,
    'currency': 'MXN',
    'customer_info': customerInfo,
    'discount_lines': discountLines,
    'metadata': metadata,
    'entrega_a_domicilio': entregaADomicilio,
    'charges': [{
      'payment_method': {
        'type': 'default'
      }
    }],
    'shipping_contact': shippingContact,
    'shipping_lines': [{
      'amount': 0,
      'carrier': 'FEDEX'
    }],
  };

  // if (entregaADomicilio) {
  //   orderObject["shipping_contact"] = shippingContact;
  //   orderObject["shipping_lines"] = [{
  //     'amount': 0,
  //     'carrier': 'FEDEX'
  //   }];
  // } else {
  //   orderObject["shipping_contact"] = {address: {
  //           street1: "El usuario lo recoge",
  //           city: "Ciudad de Mexico",
  //           state: "Ciudad de Mexico",
  //           country: "mx",
  //           postal_code: "78215"
  //       }};
  //   orderObject["shipping_lines"] = [{
  //     'amount': 0,
  //     'carrier': 'FEDEX'
  //   }];
  // }

  return conekta.Order.create(orderObject, function(err, res) {
      if(err) {
        console.log("errorrr es ", err);
        response.json({error: err.message, message: err.details[0].message});
        return;
      }
      var order = res.toObject();
      console.log("successfully created order!: ", order);
      response.status(200).json({message: "Order made succesfully", order});
  });
});

app.post("/createCharge", function(request, response) {
  console.log("the full body is ", request.body);
  const token = request.body.token;
  const customerId = request.body.customerId;
  const name = request.body.name;
  const email = request.body.email;

  return conekta.Order.create({
        "currency": "MXN",
        "customer_info": {
            "name": "Charls Crypto",
            "email": "jul@conekta.io",
        },
        "line_items": [{
            "name": "OneFood",
            "description": "24 OneFoods",
            "unit_price": 35000,
            "quantity": 1,
            "tags": ["chocolate", "vainilla"],
            "type": "physical"
        }]
      }, function(err, res) {
        if (err) {
          console.log("here with error: ", err.message);
            console.log(err.type);
            // const response = {
            //    statusCode: 500,
            //    headers: {
            //      'Access-Control-Allow-Origin': '*',
            //    },
            //    body: JSON.stringify({
            //      error: err.message,
            //    }),
            //  };
             //callback(null, response);

             err.status(500).json({error: err.message});
            return;
        }
        // successfully made the charge
        var charge = res.toObject();
        //printOrderInfo(charge);

        // const response = {
        //     statusCode: 200,
        //     headers: {
        //       'Access-Control-Allow-Origin': '*',
        //     },
        //     body: JSON.stringify({
        //       message: `Charge processed succesfully!`,
        //       charge,
        //     }),
        //   };
        console.log("successful charge cawn ", charge);
        response.status(200).json({message: "Charge successful", charge});
        //callback(null, response);

        //console.log(res.toObject());
    })
});

module.exports.handler = serverless(app);



// module.exports.handler = (event, context, callback) => {
//
//     console.log("full event: ", event);
//
//     const requestBody = JSON.parse(event.body);
//     console.log("req body: ", requestBody);
//     console.log("conektaToken: ", requestBody.token);
//   // const token = requestBody.token.id;
//   // const amount = requestBody.charge.amount;
//   // const currency = requestBody.charge.currency;
//   console.log("creating charge");
//
//   return conekta.Order.create({
//       "currency": "MXN",
//       "customer_info": {
//           "name": "Charls Crypto",
//           "phone": "+5215555555555",
//           "email": "jul@conekta.io"
//       },
//       "line_items": [{
//           "name": "OneFood",
//           "description": "24 OneFoods",
//           "unit_price": 35000,
//           "quantity": 1,
//           "tags": ["chocolate", "vainilla"],
//           "type": "physical"
//       }]
//     }, function(err, res) {
//       if (err) {
//           console.log(err.type);
//           const response = {
//              statusCode: 500,
//              headers: {
//                'Access-Control-Allow-Origin': '*',
//              },
//              body: JSON.stringify({
//                error: err.message,
//              }),
//            };
//            callback(null, response);
//           return;
//       }
//       // successfully made the charge
//       var charge = res.toObject();
//       //printOrderInfo(charge);
//
//       const response = {
//           statusCode: 200,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//           },
//           body: JSON.stringify({
//             message: `Charge processed succesfully!`,
//             charge,
//           }),
//         };
//       callback(null, response);
//
//       console.log(res.toObject());
//   })
// };


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
