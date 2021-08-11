const app = require('./app');

const { PORT = 4000 } = process.env;
// Start the server
app.listen(PORT).on('listening', () => console.log(`Feathers server listening on localhost:${PORT}`));
