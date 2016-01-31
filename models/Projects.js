var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
	title: String,
	description: String,
	description2: String,
	url: String,
	date: String,
	images: [{
		url: String,
		description: String
	}]
});

mongoose.model('Project', ProjectSchema);

/*images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}]*/