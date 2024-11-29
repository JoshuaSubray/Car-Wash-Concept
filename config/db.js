const mongoose = require('mongoose');
/*TODO:
add an external dotenv file.
remove the urlParser and unifiedTopology warnings.
*/

// Database Connection.
const url = 'mongodb+srv://jamesgriffiths23:1054g087@central.r9mof.mongodb.net';

// Primary Database Connection.
const urlAuth = url + '/userAuth';
mongoose.connect(urlAuth, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB.'))
  .catch(err => console.error('Error connecting to MongoDB.', err));

// Secondary Database Connection.
const urlLogin = url + '/userlogins';
const loginConnection = mongoose.createConnection(urlLogin, { useNewUrlParser: true, useUnifiedTopology: true });



loginConnection.on('connected', () => console.log('Connected to MongoDB Login.'));
loginConnection.on('error', err => console.error('Error connecting to Login MongoDB.', err));

// Export Connections
module.exports = { mongoose, loginConnection };