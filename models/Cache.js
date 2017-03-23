const mongoose = require('mongoose');

const CacheSchema = new mongoose.Schema({
	endpoint: String,
	response: String,
	date: String
});

module.exports = mongoose.model('Cache', CacheSchema);