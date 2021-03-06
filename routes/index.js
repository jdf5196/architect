var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var jwt = require('express-jwt');
var router = express.Router();
var Project = mongoose.model('Project');
var News = mongoose.model('News');
var User = mongoose.model('User');
var nodemailer = require('nodemailer');
var secret = process.env.TOKEN;
var email = process.env.EMAIL;
var crypto = require('crypto');
var uuid = require('node-uuid');
var Auth = jwt({secret: secret, userProperty: 'payload'});

var transporter = nodemailer.createTransport('SMTP', {
	service: 'Gmail',
	auth: {
		user: 'johnfranconawebsite@gmail.com',
		pass: email
	}
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/projectlist', function(req, res, next){
	Project.find(function(err, projectlist){
		if(err){return next(err);}
		res.json(projectlist);
	});
});

router.get('/newslist', function(req, res, next){
	News.find(function(err, newslist){
		if(err){return next(err);}
		res.json(newslist);
	});
});

router.get('/projectlist/:project', function(req, res, next) {
  req.project.populate('images', function(err, project) {
    if (err) { return next(err); }

    res.json(project);
  });
});

router.post('/projectlist', Auth, function(req, res, next){
	var project = new Project(req.body);

	project.save(function(err, project){
		if(err){return next(err);}

		res.json(project);
	});
});

router.post('/newslist', Auth, function(req, res, next){
	var news = new News(req.body);

	news.save(function(err, news){
		if(err){return next(err);}

		res.json(news);
	});
});

router.put('/newslist/:news', Auth, function(req, res, next){
	var news = req.news;

	news.publication = req.body.publication;
	news.title = req.body.title;
	news.author = req.body.author;
	news.description = req.body.description;
	news.url = req.body.url;
	news.date = req.body.date;

	news.save(function(err, news){
		if(err){return next(err);}
		res.json(news);
	});
});

router.put('/projectlist/:project', Auth, function(req, res, next){
	var project = req.project;

	project.title = req.body.title;
	project.description = req.body.description;
	project.description2 = req.body.description2;
	project.url = req.body.url;
	project.date = req.body.date;

	project.save(function(err, project){
		if(err){return next(err);}
		res.json(project);
	});
});

router.post('/projectlist/:project/images', Auth, function(req, res, next){

	var project = req.project;

	project.images.push(req.body);
	project.save(function(err, project){
		if(err){return next(err);}
		res.json(project);
	});

});

router.param('project', function(req, res, next, id){
	var query = Project.findById(id);

	query.exec(function(err, project){
		if(err){return next(err);}
		if(!project){return next(new Error('can\'t find project'));}

		req.project = project;
		return next();
	});
});

router.param('news', function(req, res, next, id){
	var query = News.findById(id);

	query.exec(function(err, news){
		if(err){return next(err);}
		if(!news){return next(new Error('can\'t find news'));}

		req.news = news;
		return next();
	});
});

router.param('user', function(req, res, next, id){
	var query = User.findById(id);

	query.exec(function(err, user){
		if(err){return next(err);}
		if(!user){return next(new Error('can\'t find user'));}

		req.user = user;
		return next();
	});
});

router.get('/projectlist/:project/images', function(req, res){
	res.json(req.project.images);
});

router.get('/newslist/:news', function(req, res){
	res.json(req.news);
});

router.delete('/newslist/:news', Auth, function(req, res, next){
	News.remove({news:req.news}, function(err){
		if(err){
			return next(err);
		}
		req.news.remove(function(err){
			if(err){
				return next(err);
			}
			res.send('success')
		});
	});
});

router.delete('/projectlist/:project', Auth, function(req, res, next){
	Project.remove({project:req.project}, function(err){
		if(err){
			return next(err);
		}
		req.project.remove(function(err){
			if(err){
				return next(err);
			}
			res.send('success')
		});
	});
});

router.put('/projectlist/:project/images', Auth, function(req, res, next){

	var image;
	var project = req.project;

	for(var i = 0; i<req.project.images.length; i++){
		if(project.images[i].url == req.body.url && project.images[i].description === req.body.description){
			image = project.images[i];
		};
	};
	project.images.splice(project.images.indexOf(image), 1);

	project.save(function(err, project){
		if(err){return next(err);}
		res.json(project);
	});
});

router.post('/contact', function(req, res, next){

	transporter.sendMail({
		from: req.body.contactEmail,
		to: 'john.d.francona@gmail.com',
		subject: 'Website Message from '+req.body.contactName+', '+req.body.contactEmail,
		text: req.body.contactMessage,
		html: req.body.contactMessage
	}, function(err){
		if(err){console.log(err);}
	});
	transporter.close();
	res.json('success');
});

router.post('/register', function(req, res, next){
	var password = uuid.v4();

	if(!req.body.username){
		return res.status(400).json({message: 'Please fill out all fields.'});
	}
	var user = new User();
	user.username = req.body.username;
	user.setPassword(password);
	user.save(function(err){
		if(err){return next(err);}
		return res.json({token: user.generateJWT()})
	});
	transporter.sendMail({
		from: req.body.contactEmail,
		to: 'john.d.francona@gmail.com',
		subject: 'Website Registration Message',
		text: 'This is your login information: username: '+req.body.username+ ' password: '+ password,
		html: 'This is your login information: username: '+req.body.username+ ' password: '+ password
	}, function(err){
		if(err){console.log(err);}
	});
	transporter.close();
});

router.put('/register/:user', Auth, function(req, res, next){
	var valid = req.user.validPassword(req.body.oldPassword);
	if(valid === false){
		return res.status(400).json({message: 'Current Password Incorrect'});
	}
	else if(valid === true){

		var salt = crypto.randomBytes(16).toString('hex');
		var hash = crypto.pbkdf2Sync(req.body.Password, salt, 1000, 64).toString('hex');

		req.user.salt = salt;
		req.user.hash = hash;
		req.user.save(function(err, user){
			if(err){return next(err);}
			res.json(user);
		});
	};	
});

router.post('/login', function(req, res, next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message:'Please fill out all fields.'});
	}
	passport.authenticate('local', function(err, user, info){
		if(err){return next(err);}

		if(user){
			return res.json({token: user.generateJWT()});
		}
		else{
			return res.status(401).json(info);
		}
	})(req, res, next);
});

module.exports = router;


