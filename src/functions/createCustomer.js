'use strict';

const {makeStripeInstance} = require('./../misc/makeStripeInstance');
const {
  getBody,
  createResponse,
  createErrorResponse,
} = require('@gemcook/sls-utils');

const _createCustomer = async (event, callback) => {
  const stripe = await makeStripeInstance(process.env.STRIPE_SECRET_NAME);
  const body = getBody(event);

  return new Promise((resolve, reject) => {
    stripe.customers.create(
      {
        source: body.id,
        email: body.email,
        shipping: {
          address: {
            line1: body.card.address_zip,
          },
          name: body.username,
        },
        metadata: body.metadata ? body.metadata : {},
      },
      async (err, customer) => {
        if (err) {
          const response = createErrorResponse(500, err);
          console.error(err);
          callback(null, response);
          reject();
        }

        callback(null, createResponse(200, customer));
        resolve();
      },
    );
  });
};

module.exports.handler = async (event, context, callback) => {
  try {
    await _createCustomer(event, callback);
    return;
  } catch (error) {
    console.error(error);
  }
};
