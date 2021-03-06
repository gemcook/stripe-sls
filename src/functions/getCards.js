'use strict';

const {makeStripeInstance} = require('./../misc/makeStripeInstance');
const {
  getBody,
  getOptions,
  createResponse,
  createErrorResponse,
} = require('@gemcook/sls-utils');

const _getCards = async (event, callback) => {
  const stripe = await makeStripeInstance(process.env.STRIPE_SECRET_NAME);
  const body = getBody(event);
  const options = getOptions(event);

  return new Promise((resolve, reject) => {
    stripe.customers.listCards(body.customer_id, options, async (err, data) => {
      if (err) {
        const response = createErrorResponse(500, err);
        console.error(err);
        callback(null, response);
        reject();
      }

      callback(null, createResponse(200, data));
      resolve();
    });
  });
};

module.exports.handler = async (event, context, callback) => {
  try {
    await _getCards(event, callback);
    return;
  } catch (error) {
    console.error(error);
  }
};
