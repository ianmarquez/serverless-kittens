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
        return {[entry[0]]: value};
      }
    }

    if (Array.isArray(obj)) {
      let result = []
      for (const entries of Object.values(obj)) {
        let parsedVal = {};
        for (const key in entries) {
          parsedVal = {...parsedVal, ...removeDBType({[key]: entries[key]})}
        }
        result.push(parsedVal);
      }
      return result;
    } else {
      let result= {};
      for (const key in obj) {
        result = {...result, ...removeDBType({[key]:obj[key]})}  
      }
      return result;
    }
  }
}