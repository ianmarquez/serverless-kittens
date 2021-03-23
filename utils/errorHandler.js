module.exports = {
  handleError: (error, statusCode, errorLogMsg, responseBody)  => {
  errorLogMsg && console.error(errorLogMsg);
    error && console.error('An error has occured with error:', JSON.stringify(error));
    return {
      statusCode,
      ...(responseBody ? JSON.stringify(responseBody) : {})
    }
  }
}