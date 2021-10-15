const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/web2_cch');
mongoose.Promise = global.Promise;

module.exports = mongoose;