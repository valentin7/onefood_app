'use strict';

//const request = require('sync-request');

module.exports.conektaWebhookListener = (event, context, callback) => {
  const body = JSON.parse(event.body)

  var data = typeof req.body == 'string' ? JSON.parse(event.body) : event.body;
  console.log("heyyy ", data);

  if (data.type == 'order.paid') {
    // try {
    //   var mail = {
    //       from: me,
    //       to: you,
    //       subject: 'Pago comprobado',
    //       text: 'Tu pago ha sido confirmado.'
    //   };
    //   transporter.sendMail(mail, function(error, info){
    //       if(error){ return console.log(error); }
    //     });
    console.log("Orden de subscripcion pagada succesfully!! ", data);
    // } catch (err) {
    //   console.log(err);
    //   callback(err);
    // }
  }

  console.log("handled successfully");
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Event processed"
    }),
  };
  callback(null, response);
};


const sendEmailConfirmation = (repo, stars, username, url) => {
  const resp = request('POST', WEBHOOK_URL, {
    json: { text }
  });

  // Use getBody to check if there was an error.
  resp.getBody();
}

// const sendToSlack = (repo, stars, username, url) => {
//   const text = [
//     `New Github star for _${repo}_ repo!.`,
//     `The *${repo}* repo now has *${stars}* stars! :tada:.`,
//     `Your new fan is <${url}|${username}>`
//   ].join('\n');
//   const resp = request('POST', WEBHOOK_URL, {
//     json: { text }
//   });
//
//   // Use getBody to check if there was an error.
//   resp.getBody();
// }
