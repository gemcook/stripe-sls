'use strict';

const {makeStripeInstance} = require('./../misc/makeStripeInstance');
const {
  getBody,
  createResponse,
  createErrorResponse,
} = require('@gemcook/sls-utils');

const _createPlan = async (event, callback) => {
  const stripe = await makeStripeInstance(process.env.STRIPE_SECRET_NAME);
  const body = getBody(event);

  return new Promise((resolve, reject) => {
    stripe.plans.create(
      {
        amount: body.amount,
        interval: body.interval,
        product: {
          name: body.name,
        },
        currency: 'jpy',
        nickname: body.name,
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
    await _createPlan(event, callback);
    return;
  } catch (error) {
    console.error(error);
  }
};
