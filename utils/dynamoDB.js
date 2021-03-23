const { DynamoDB } = require('aws-sdk');

const dynamoDB = new DynamoDB.DocumentClient();

module.exports = {
  transact: async (method, params) => {
    return dynamoDB[method](params).promise();
  }
}