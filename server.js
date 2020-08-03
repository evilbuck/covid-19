const app = require('./app');

// Start the server
app
  .listen(3000)
  .on('listening', () => console.log('Feathers server listening on localhost:3000'));
