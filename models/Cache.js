const mongoose = require('mongoose');

mongoose.Promise = Promise;

const CacheSchema = new mongoose.Schema({
	endpoint: String,
	response: String,
	date: String
});

module.exports = mongoose.model('Cache', CacheSchema);