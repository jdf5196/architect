/*Service to get, create, update, and delete Projects*/

app.service('projectsList', ['$http', function($http){
	var projects = {
		projects: []
	};

	projects.getAll = function(){
		return $http.get('/projectlist').success(function(data){
			angular.copy(data, projects.projects);
		});
	};

	projects.create = function(project){
		return $http.post('/projectlist', project, function(data){
			projects.projects.push(data);
		});
	};

	projects.delete = function(project){
		$http.delete('/projectlist/' + project._id, function(){
			projects.projects.splice(projects.projects.indexOf(projects),1);
		});
	};

	projects.addImage = function(id, image){
		console.log(image);
		return $http.post('/projectlist/'+id+'/images', image, function(data){
		});
	};

	/*projects.get = function(id){
		return $http.get('/projectlist/'+id).then(function(res){
			return res.data;
		});
	};*/

	projects.update = function(project, id){
		return $http.put('/projectlist/'+id, project, function(data){
		});
	};

	projects.deleteImage = function(image, id){
		return $http.put('/projectlist/'+id+'/images', image, function(data){
		});
	};

	return projects;
}]);

/*Service to get, create, update, and delete news articles*/

app.service('newslist', ['$http', function($http){
	var news = {
		news: []
	};

	news.getAll = function(){
		return $http.get('/newslist').success(function(data){
			angular.copy(data, news.news);
		});
	};

	news.create = function(news){
		return $http.post('/newslist', news, function(data){
			news.news.push(data);
		});
	};

	news.update = function(news, id){
		return $http.put('/newslist/'+id, news, function(data){
		});
	};

	news.delete = function(news){
		$http.delete('/newslist/' + news._id, function(){
			news.news.splice(news.news.indexOf(news), 1);
		});
	};

	return news;
}]);
