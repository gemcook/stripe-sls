const AWS = require('aws-sdk');
const endpoint = 'https://secretsmanager.ap-northeast-1.amazonaws.com';
const region = 'ap-northeast-1';

// Create a Secrets Manager client
const client = new AWS.SecretsManager({
  endpoint: endpoint,
  region: region,
});

exports.makeStripeInstance = secretName => {
  return new Promise((resolve, reject) => {
    client.getSecretValue({SecretId: secretName}, function(err, data) {
      if (err) {
        console.error(err);
        if (err.code === 'ResourceNotFoundException') {
          reject('The requested secret ' + secretName + ' was not found');
        } else if (err.code === 'InvalidRequestException') {
          reject('The request was invalid due to: ' + err.message);
        } else if (err.code === 'InvalidParameterException') {
          reject('The request had invalid params: ' + err.message);
        }
      } else {
        if (data.SecretString !== '') {
          const stripe = require('stripe')(
            JSON.parse(data.SecretString)[secretName],
          );

          resolve(stripe);
        }
      }
    });
  });
};
