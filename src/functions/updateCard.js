'use strict';

const {makeStripeInstance} = require('./../misc/makeStripeInstance');
const {
  getBody,
  createResponse,
  createErrorResponse,
} = require('@gemcook/sls-utils');

const _updateCard = async (event, callback) => {
  const stripe = await makeStripeInstance(process.env.STRIPE_SECRET_NAME);
  const body = getBody(event);

  return new Promise((resolve, reject) => {
    stripe.plans.updateCard(
      body.customer_id,
      body.card_id,
      {
        name: body.name,
        exp_month: body.exp_month,
        exp_year: body.exp_year,
        address_zip: body.address_zip,
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
    await _updateCard(event, callback);
    return;
  } catch (error) {
    console.error(error);
  }
};
