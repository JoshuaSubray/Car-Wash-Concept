const mongoose = require('mongoose');

// Primary Database Connection
const uri = 'mongodb+srv://jamesgriffiths23:1054g087@central.r9mof.mongodb.net/userAuth';
//const uri = 'mongodb+srv://N01645357:vNTX679I1r7tAzj8@cluster.ohskr.mongodb.net/userAuth';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB.'))
  .catch(err => console.error('Error connecting to MongoDB.', err));

// Secondary Database Connection
const loginUri = 'mongodb+srv://jamesgriffiths23:1054g087@central.r9mof.mongodb.net/userlogins';
const loginConnection = mongoose.createConnection(loginUri, { useNewUrlParser: true, useUnifiedTopology: true });



loginConnection.on('connected', () => console.log('Connected to MongoDB Login.'));
loginConnection.on('error', err => console.error('Error connecting to Login MongoDB.', err));

// Export Connections
module.exports = { mongoose, loginConnection };