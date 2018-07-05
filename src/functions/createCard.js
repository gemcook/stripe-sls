'use strict';

const {makeStripeInstance} = require('./../misc/makeStripeInstance');
const {
  getBody,
  createResponse,
  createErrorResponse,
} = require('@gemcook/sls-utils');

const _createCard = async (event, callback) => {
  const stripe = await makeStripeInstance(process.env.STRIPE_SECRET_NAME);
  const body = getBody(event);

  return new Promise((resolve, reject) => {
    stripe.customers.createSource(
      body.customer_id,
      {
        source: body.token_id,
        metadata: body.metadata ? body.metadata : {},
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
    await _createCard(event, callback);
    return;
  } catch (error) {
    console.error(error);
  }
};
