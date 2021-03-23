'use strict';
const { transact } = require('./utils/dynamoDB');
const { handleError, removeDynamoDBType } = require('./utils/utils');

module.exports.create = async (event) => {
  
  let bodyObj = {};
  try {
    bodyObj = JSON.parse(event.body);
  } catch (jsonError) {
    return handleError(jsonError, 400, 'There was an error parsing the body.')
  }

  const { name, age } = bodyObj
  if (typeof name === 'undefined' || typeof age === 'undefined') 
    return handleError(null, 400, 'Missing create parameters')

  let putParams = {
    TableName: process.env.DYNAMODB_KITTEN_TABLE,
    Item: {
      "name": { S: name },
      "age": { S: isNaN(age) ? age : age.toString() }
    }
  }

  try {
    await transact('putItem', putParams);
  } catch (dynamoDBError) {
    return handleError(dynamoDBError, 500, 'There was an error accessing DynamoDB');
  }

  return {
    statusCode: 201
  }
}

module.exports.list = async () => {
  let scanParams = {
    TableName: process.env.DYNAMODB_KITTEN_TABLE,
    AttributesToGet: ['name', 'age'],
  }

  let scanResult = {};
  try {
    scanResult = await transact('scan', scanParams);
  } catch (scanError) {
    return handleError(scanError, 500, 'There was an error accessing DynamoDB');
  }

  if (scanResult.Items === null || !Array.isArray(scanResult.Items) || scanResult.Items.length === 0) {
    return handleError(null, 404, 'No Kittens Found in Database');
  }

  return {
    statusCode: 200,
    body: JSON.stringify(removeDynamoDBType(scanResult.Items))
  }
}

module.exports.get = async (event) => {
  let getParams = {
    TableName: process.env.DYNAMODB_KITTEN_TABLE,
    Key: {
      "name": {
        S: event.pathParameters.name
      }
    }
  }

  let getResult = {};
  try {
    getResult = await transact('getItem', getParams);
  } catch (getError) {
    return handleError(getError, 500, 'There was an error accessing DynamoDB');
  }

  if (!getResult.Item) 
    return handleError(null, 404, `No Kitten with the name: ${event.pathParameters.name} Found in Database`);

  return {
    statusCode:200,
    body: JSON.stringify(removeDynamoDBType(getResult.Item)),
  }
}

module.exports.update = async (event) => {
  let bodyObj = {};
  try {
    bodyObj = JSON.parse(event.body);
  } catch (jsonError) {
    return handleError(jsonError, 400, 'There was an error parsing the request body.');
  }
  const name = event.pathParameters.name;
  const { age } = bodyObj;
  if(typeof age === 'undefined') {
    return handleError(null, 404, 'Incorrect parameters');
  }

  let updateParams = {
    TableName: process.env.DYNAMODB_KITTEN_TABLE,
    Key: { "name": { S: name } },
    UpdateExpression: 'set #age = :age',
    ExpressionAttributeNames: {
      '#age': 'age'
    },
    ExpressionAttributeValues: {
      ':age': { S: isNaN(age) ? age : age.toString() }
    }
  }
  try {
    await transact('updateItem', updateParams);
  } catch (dynamoDBError) {
    return handleError(dynamoDBError, 500, 'There was an error updating');
  }

  return {
    statusCode: 200
  }
}

module.exports.delete = async (event) => {
  let deleteParams = {
    TableName: process.env.DYNAMODB_KITTEN_TABLE,
    Key: {
      name: { S: event.pathParameters.name }
    }
  }
  try {
    await transact('deleteItem', deleteParams);
  } catch (deleteError) {
    return handleError(deleteError, 500, 'There was an error deleting');
  }
  
  return { statusCode:201 };
}