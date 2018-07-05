'use strict';

const {makeStripeInstance} = require('./../misc/makeStripeInstance');
const {
  getBodyOptions,
  createResponse,
  createErrorResponse,
} = require('@gemcook/sls-utils');

const _getCharges = async (event, callback) => {
  const stripe = await makeStripeInstance(process.env.STRIPE_SECRET_NAME);
  const options = getBodyOptions(event);

  return new Promise((resolve, reject) => {
    stripe.charges.list(options, async (err, data) => {
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
    await _getCharges(event, callback);
    return;
  } catch (error) {
    console.error(error);
  }
};
