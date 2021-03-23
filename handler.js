'use strict';
const { transact } = require('./utils/dynamoDB');
const { handleError } = require('./utils/errorHandler');

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
    Item: { name, age }
  }

  try {
    await transact('put', putParams);
  } catch (dynamoDBError) {
    return handleError(dynamoDBError, 500, 'There was an error accessing DynamoDB');
  }

  return {
    statusCode: 201
  }
}

module.exports.list = async () => {
  let scanParams = {
    TableName: process.env.DYNAMODB_KITTEN_TABLE
  }

  let scanResult = {};
  try {
    scanResult = transact('scan', scanParams);
  } catch (scanError) {
    return handleError(scanError, 500, 'There was an error accessing DynamoDB');
  }

  if (scanResult.Items === null || !Array.isArray(scanResult.Items) || scanResult.Items.length === 0) {
    return handleError(null, 404, 'No Kittens Found in Database');
  }

  return {
    statusCode: 200,
    body: JSON.stringify(scanResult.items.map(({name, age}) => ({ name, age })))
  }
}

module.exports.get = async (event) => {
  let getParams = {
    TableName: process.env.DYNAMODB_KITTEN_TABLE,
    Key: {
      name: event.pathParameters.name
    }
  }

  let getResult = {};
  try {
    getResult = await transact('get', getParams);
  } catch (getError) {
    return handleError(getError, 500, 'There was an error accessing DynamoDB');
  }

  if (!getResult.Item) 
    return handleError(null, 404, `No Kitten with the name: ${event.pathParameters.name} Found in Database`);

  const { name, age } = getResult.Item;

  return {
    statusCode:200,
    body: JSON.stringify({ name, age }),
  }
}

module.exports.update = async (event) => {
  let bodyObj = {};
  try {
    bodyObj = JSON.parse(event.body);
  } catch (jsonError) {
    return handleError(jsonError, 400, 'There was an error parsing the request body.');
  }
  const { age, name } = bodyObj;
  if(typeof age === 'undefined') {
    return handleError(null, 404, 'Incorrect parameters');
  }

  let updateParams = {
    TableName: process.env.DYNAMODB_KITTEN_TABLE,
    Key: { name },
    UpdateExpression: 'set #age = :age',
    ExpressionAttributeName: {
      '#age': 'age'
    },
    ExpressionAttributeValues: {
      ':age': age
    }
  }
  try {
    await transact('update', updateParams);
  } catch (dynamoDBError) {
    return handleError(dynamoDBError, 500, 'There was an error updating');
  }

  return {
    statusCode: 200
  }
}

module.exports.del = async (event) => {
  let deleteParams = {
    TableName: process.env.DYNAMODB_KITTEN_TABLE,
    Key: {
      name: event.pathParameters.name
    }
  }
  try {
    await transact('delete', deleteParams);
  } catch (deleteError) {
    return handleError(deleteError, 500, 'There was an error deleting');
  }
  
  return { statusCode:201 };
}