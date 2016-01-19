var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
	publication: String,
	title: String,
	author: String,
	description: String,
	url: String, 
	date: String
});

mongoose.model('News', NewsSchema);