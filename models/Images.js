var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
	url: String,
	description: String,
	project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
});

mongoose.model('Image', ImageSchema);