var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var Project = mongoose.model('Project');
var News = mongoose.model('News');
var Image = mongoose.model('Image');

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

router.post('/projectlist', function(req, res, next){
	var project = new Project(req.body);

	project.save(function(err, project){
		if(err){return next(err);}

		res.json(project);
	});
});

router.post('/newslist', function(req, res, next){
	var news = new News(req.body);

	news.save(function(err, news){
		if(err){return next(err);}

		res.json(news);
	});
});

router.put('/newslist/:news', function(req, res, next){
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

router.put('/projectlist/:project', function(req, res, next){
	var project = req.project;

	project.title = req.body.title;
	project.description = req.body.description;
	project.description2 = req.body.description2;
	project.mainImage = req.body.mainImage;
	project.type = req.body.type;
	project.url = req.body.url;
	project.date = req.body.date;

	project.save(function(err, project){
		if(err){return next(err);}
		res.json(project);
	});
});

router.post('/projectlist/:project/images', function(req, res, next){
	console.log(req.body);

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

router.get('/projectlist/:project/images', function(req, res){
	res.json(req.project.images);
});

router.get('/newslist/:news', function(req, res){
	res.json(req.news);
});

router.delete('/newslist/:news', function(req, res, next){
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

router.delete('/projectlist/:project', function(req, res, next){
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

router.put('/projectlist/:project/images', function(req, res, next){
	var image;
	var project = req.project;

	for(var i = 0; i<req.project.images.length; i++){
		if(project.images[i]._id == req.body._id){
			image = project.images[i];
		};
	};

	project.images.splice(project.images.indexOf(image), 1);

	project.save(function(err, project){
		if(err){return next(err);}
		res.json(project);
	});
});

module.exports = router;


