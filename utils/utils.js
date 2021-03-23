module.exports = {
  handleError: (error, statusCode, errorLogMsg, responseBody)  => {
  errorLogMsg && console.error(errorLogMsg);
    error && console.error('An error has occured with error:', JSON.stringify(error));
    return {
      statusCode,
      ...(responseBody ? JSON.stringify(responseBody) : {})
    }
  },
  removeDynamoDBType: (obj) => {
    const removeDBType = (item) => {
      for (const entry of Object.entries(item)) {
        for (const value of Object.values(entry[1]))
        res[entry[0]] = value;
      }
    }
    const res = {};
    if (Array.isArray(obj)) {
      for (const item of Object.values(obj)) {
        removeDBType(item)
      }
    } else {
      removeDBType(obj)
    }
    
    return res;
  }
}