'use strict';

const {makeStripeInstance} = require('./../misc/makeStripeInstance');
const {
  getBody,
  createResponse,
  createErrorResponse,
} = require('@gemcook/sls-utils');

const _createToken = async (event, callback) => {
  const stripe = await makeStripeInstance(process.env.STRIPE_SECRET_NAME);
  const body = getBody(event);

  return new Promise((resolve, reject) => {
    stripe.tokens.create(
      {
        card: {
          number: body.number,
          exp_month: body.exp_month,
          exp_year: body.exp_year,
          cvc: body.cvc,
          name: body.name ? body.name : null,
          address_zip: body.address_zip ? body.address_zip : null,
        },
      },
      async (err, data) => {
        if (err) {
          const response = createErrorResponse(500, err);
          console.error(err);
          callback(null, response);
          reject();
        }

        callback(null, createResponse(200, data));
        resolve();
      },
    );
  });
};

module.exports.handler = async (event, context, callback) => {
  try {
    await _createToken(event, callback);
    return;
  } catch (error) {
    console.error(error);
  }
};
