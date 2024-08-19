// restRequestHandler.js
module.exports = () => ({
    handle(response, error = null) {
      if (error) {
        console.error('REST error handler:', error);
      } else {
        console.log('REST response handler:', response);
      }
    },
  });