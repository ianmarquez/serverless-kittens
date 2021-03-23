const { DynamoDB } = require('aws-sdk');

const client = new DynamoDB({ region: process.env.AWS_REGION });

module.exports = {
  transact: (method, params) => {
    console.log(params);
    return client[method](params).promise();
  }
}