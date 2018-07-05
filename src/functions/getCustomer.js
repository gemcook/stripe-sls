'use strict';

const {makeStripeInstance} = require('./../misc/makeStripeInstance');
const {
  getBody,
  createResponse,
  createErrorResponse,
} = require('@gemcook/sls-utils');

const _getCustomer = async (event, callback) => {
  const stripe = await makeStripeInstance(process.env.STRIPE_SECRET_NAME);
  const headers = getBody(event);

  return new Promise((resolve, reject) => {
    stripe.customers.retrieve(headers.customer_id, (err, customer) => {
      if (err) {
        console.error(err);
        const response = createErrorResponse(500, err);

        callback(null, response);
        reject();
      }

      callback(null, createResponse(200, customer));
      resolve();
    });
  });
};

module.exports.handler = async (event, context, callback) => {
  try {
    await _getCustomer(event, callback);
    return;
  } catch (error) {
    console.error(error);
  }
};
